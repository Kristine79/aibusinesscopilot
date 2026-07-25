import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


def validate_environment() -> list[str]:
    warnings: list[str] = []

    if settings.SECRET_KEY == "change-me-in-production":
        warnings.append("SECRET_KEY is using default value — change it in production")

    if not settings.OPENAI_API_KEY and not settings.OPENROUTER_API_KEY:
        warnings.append("No AI provider API keys configured — AI features will fail")

    if settings.DEFAULT_AI_PROVIDER == "openai" and not settings.OPENAI_API_KEY:
        warnings.append("DEFAULT_AI_PROVIDER=openai but OPENAI_API_KEY is not set")

    if settings.DEFAULT_AI_PROVIDER == "openrouter" and not settings.OPENROUTER_API_KEY:
        warnings.append("DEFAULT_AI_PROVIDER=openrouter but OPENROUTER_API_KEY is not set")

    for warning in warnings:
        logger.warning("Environment: %s", warning)

    if not warnings:
        logger.info("Environment validation passed")

    return warnings
