from __future__ import annotations

from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    llm_api_key: SecretStr = Field(alias="LLM_API_KEY")
    llm_name: str = Field(default="gemini/gemini-flash-lite-latest", alias="LLM_NAME")
    llm_api_base: str | None = Field(default=None, alias="LLM_API_BASE")
    otel_project_name: str = Field(default="ai-tutor-service", alias="OTEL_PROJECT_NAME")
    phoenix_collector_endpoint: str = Field(alias="PHOENIX_COLLECTOR_ENDPOINT")
    tutor_api_key: SecretStr = Field(alias="TUTOR_API_KEY")
    model_config = SettingsConfigDict(env_file=".env", env_prefix="", env_ignore_empty=True)
    ollama_base_url: str = Field(default="http://localhost:11434", alias="OLLAMA_BASE_URL")
    ollama_judge_model: str = Field(default="gemma3:4b", alias="OLLAMA_JUDGE_MODEL")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[missing-argument]
