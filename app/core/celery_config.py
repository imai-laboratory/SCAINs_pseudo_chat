from app.core.config import get_settings

settings = get_settings()

broker_url = f'rediss://{settings.REDIS_USER}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}?ssl_cert_reqs=CERT_NONE'
result_backend = broker_url
worker_concurrency = 10  # 初期設定として10に設定

task_annotations = {
    'app.tasks.fetch_openai_data': {'rate_limit': '300/m'}  # タスクごとのレートリミット
}
