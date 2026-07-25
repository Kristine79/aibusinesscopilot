from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel


class AIProvider(ABC):
    @abstractmethod
    async def generate_completion(self, prompt: str, **kwargs: Any) -> str: ...

    @abstractmethod
    async def generate_structured_response(
        self,
        prompt: str,
        response_schema: type[BaseModel],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> BaseModel: ...


class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed(self, text: str) -> list[float]: ...

    @abstractmethod
    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        ...
