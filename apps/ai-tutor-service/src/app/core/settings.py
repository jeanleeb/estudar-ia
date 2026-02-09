from __future__ import annotations

from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    llm_api_key: SecretStr = Field(alias="LLM_API_KEY")
    llm_name: str = Field(default="gemini/gemini-2.5-flash", alias="LLM_NAME")
    model_config = SettingsConfigDict(env_file=".env", env_prefix="")


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[missing-argument]
