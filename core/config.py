import os
from functools import lru_cache
from pydantic_settings import BaseSettings

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    """ 環境変数を読み込む """
    database_url: str
    openai_api_key: str
    local_url: str
    prod_url: str

    # Additional variables
    postgres_user: str
    postgres_password: str
    postgres_db: str

    class Config:
        env_file = os.path.join(PROJECT_ROOT, '..', '.env')
        # extra = "ignore"  # 未定義の環境変数を無視


@lru_cache
def get_settings():
    """ @lru_cacheで.envの結果をキャッシュする """
    return Settings()
