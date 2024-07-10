import os
from functools import lru_cache
from pydantic_settings import BaseSettings

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    """ 環境変数を読み込む """
    openai_api_key: str
    local_url: str
    prod_url: str

    database_url: str
    postgres_user: str
    postgres_password: str
    postgres_db: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = os.path.join(PROJECT_ROOT, '..', '.env')


@lru_cache
def get_settings():
    """ @lru_cacheで.envの結果をキャッシュする """
    return Settings()
