import base64
import os

from celery import Celery
import openai
import re
from app.core.config import get_settings

settings = get_settings()

redis_url = f'rediss://{settings.REDIS_USER}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}?ssl_cert_reqs=CERT_NONE'

celery_app = Celery('tasks', broker=redis_url, backend=redis_url)
celery_app.config_from_object('app.core.celery_config')


@celery_app.task(bind=True, max_retries=3)
def fetch_openai_data(self, prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0,
            stop=["\n"],
        )
        content = response['choices'][0]['message']['content']
        cleaned_content = re.sub(r'^.*?: ', '', content)
        return cleaned_content
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@celery_app.task(bind=True, max_retries=3)
def fetch_openai_data_with_image(self, image_name, prompt):
    try:
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        abs_image_path = os.path.join(project_root, 'front/src/assets/images', image_name)
        base64_image = encode_image(abs_image_path)
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300,
            temperature=0,
            stop=["\n"],
        )
        content = response['choices'][0]['message']['content']
        cleaned_content = re.sub(r'^.*?: ', '', content)
        return cleaned_content
    except Exception as exc:
        print(f"Error in fetch_openai_data_with_image: {exc}")
        raise self.retry(exc=exc, countdown=60)


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        base64_encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
    return base64_encoded_image
