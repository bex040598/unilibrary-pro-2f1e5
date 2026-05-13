from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "ATMU Smart UniLibrary API"
    api_prefix: str = ""
    jwt_secret_key: str = "change-me"
    jwt_refresh_secret_key: str = "change-me-refresh"
    access_token_expire_minutes: int = 120
    refresh_token_expire_days: int = 14
    database_url: str = "sqlite:///./unilibrary.db"
    auto_create_tables: bool = True
    auto_seed: bool = True
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> List[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

