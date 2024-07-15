from celery import Celery
import openai
import re
from core.config import get_settings

settings = get_settings()

redis_url = f'rediss://{settings.REDIS_USER}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}?ssl_cert_reqs=CERT_NONE'

celery_app = Celery('tasks', broker=redis_url, backend=redis_url)
celery_app.conf.update(
    task_annotations={
        'tasks.fetch_openai_data': {'rate_limit': '300/m'}
    }
)


@celery_app.task(bind=True, max_retries=3)
def fetch_openai_data(self, prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
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
