from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/aibusinesscopilot"
    DATABASE_SYNC_URL: str = "postgresql://postgres:postgres@db:5432/aibusinesscopilot"

    # Security
    SECRET_KEY: str = "change-me-in-production-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI Providers
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "anthropic/claude-3-haiku"

    DEFAULT_AI_PROVIDER: Literal["openai", "openrouter"] = "openai"

    # Backend
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    # Telegram
    TELEGRAM_BOT_TOKEN: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()