import json
import logging
from typing import Any

from openai import AsyncOpenAI
from pydantic import BaseModel

from app.core.config import settings
from app.modules.ai.interfaces import AIProvider, EmbeddingProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(AIProvider):
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            timeout=30.0,
            max_retries=2,
        )
        self.model = settings.OPENAI_MODEL

    async def generate_completion(self, prompt: str, **kwargs: Any) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=kwargs.get("model", self.model),
                messages=[{"role": "user", "content": prompt}],
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 2000),
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error("OpenAI completion failed: %s", str(e))
            raise

    async def generate_structured_response(
        self,
        prompt: str,
        response_schema: type[BaseModel],
        **kwargs: Any,
    ) -> BaseModel:
        try:
            response = await self.client.beta.chat.completions.parse(
                model=kwargs.get("model", self.model),
                messages=[{"role": "user", "content": prompt}],
                response_format=response_schema,
                temperature=kwargs.get("temperature", 0.3),
                max_tokens=kwargs.get("max_tokens", 3000),
            )
            message = response.choices[0].message
            if message.parsed:
                return message.parsed
            raise ValueError(f"Failed to parse structured response: {message.refusal}")
        except Exception as e:
            logger.error("OpenAI structured response failed: %s", str(e))
            raise


class OpenRouterProvider(AIProvider):
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            timeout=30.0,
            max_retries=2,
        )
        self.model = settings.OPENROUTER_MODEL

    async def generate_completion(self, prompt: str, **kwargs: Any) -> str:
        try:
            response = await self.client.chat.completions.create(
                model=kwargs.get("model", self.model),
                messages=[{"role": "user", "content": prompt}],
                temperature=kwargs.get("temperature", 0.7),
                max_tokens=kwargs.get("max_tokens", 2000),
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            logger.error("OpenRouter completion failed: %s", str(e))
            raise

    async def generate_structured_response(
        self,
        prompt: str,
        response_schema: type[BaseModel],
        **kwargs: Any,
    ) -> BaseModel:
        json_schema = response_schema.model_json_schema()
        try:
            response = await self.client.chat.completions.create(
                model=kwargs.get("model", self.model),
                messages=[
                    {
                        "role": "system",
                        "content": "You must respond with valid JSON matching the requested schema.",
                    },
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=kwargs.get("temperature", 0.3),
                max_tokens=kwargs.get("max_tokens", 3000),
            )
            content = response.choices[0].message.content or "{}"
            return response_schema.model_validate(json.loads(content))
        except json.JSONDecodeError as e:
            logger.error("OpenRouter JSON parse failed: %s", str(e))
            raise ValueError("Invalid JSON response from LLM") from e
        except Exception as e:
            logger.error("OpenRouter structured response failed: %s", str(e))
            raise


class OpenAIEmbeddingProvider(EmbeddingProvider):
    def __init__(self) -> None:
        self.client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            timeout=30.0,
            max_retries=2,
        )
        self.model = settings.OPENAI_EMBEDDING_MODEL

    async def embed(self, text: str) -> list[float]:
        response = await self.client.embeddings.create(
            model=self.model,
            input=text,
        )
        return response.data[0].embedding

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        response = await self.client.embeddings.create(
            model=self.model,
            input=texts,
        )
        result = [item.embedding for item in response.data]
        return result


_provider_cache: AIProvider | None = None
_embedding_cache: EmbeddingProvider | None = None


def get_ai_provider() -> AIProvider:
    global _provider_cache
    if _provider_cache is not None:
        return _provider_cache
    if settings.DEFAULT_AI_PROVIDER == "openrouter":
        _provider_cache = OpenRouterProvider()
    else:
        _provider_cache = OpenAIProvider()
    return _provider_cache


def get_embedding_provider() -> EmbeddingProvider:
    global _embedding_cache
    if _embedding_cache is not None:
        return _embedding_cache
    if settings.OPENAI_API_KEY:
        _embedding_cache = OpenAIEmbeddingProvider()
    else:
        from app.modules.knowledge.service import MockEmbeddingProvider
        _embedding_cache = MockEmbeddingProvider()
    return _embedding_cache