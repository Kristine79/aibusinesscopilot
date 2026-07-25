import logging
import math
import hashlib
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError
from app.database.models.document_embedding import DocumentEmbedding
from app.database.models.knowledge_document import KnowledgeDocument
from app.modules.ai.interfaces import EmbeddingProvider
from app.modules.knowledge.schemas import (
    ChatResponse,
    DocumentCreate,
    DocumentRead,
)

logger = logging.getLogger(__name__)


class MockEmbeddingProvider(EmbeddingProvider):
    def __init__(self, dimensions: int = 128):
        self.dimensions = dimensions

    async def embed(self, text: str) -> list[float]:
        n = self.dimensions
        h = hashlib.sha256(text.encode()).digest()
        vec = [((h[i % len(h)] + (i * 13)) % 256) / 255.0 for i in range(n)]
        mag = math.sqrt(sum(v * v for v in vec))
        return [v / mag for v in vec]

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [await self.embed(t) for t in texts]


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def _chunk_text(text: str, max_chars: int = 500) -> list[str]:
    paragraphs = text.split("\n")
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        stripped = para.strip()
        if not stripped:
            continue
        if len(current) + len(stripped) + 1 > max_chars and current:
            chunks.append(current.strip())
            current = stripped
        else:
            if current:
                current += "\n" + stripped
            else:
                current = stripped

    if current:
        chunks.append(current.strip())

    if not chunks:
        chunks = [text]

    return chunks


class KnowledgeService:
    def __init__(self, db: AsyncSession, embedding_provider: EmbeddingProvider | None = None):
        self.db = db
        if embedding_provider:
            self.embedder = embedding_provider
        else:
            from app.modules.ai.providers import get_embedding_provider
            self.embedder = get_embedding_provider()

    async def create_document(self, data: DocumentCreate) -> DocumentRead:
        doc = KnowledgeDocument(
            title=data.title,
            content=data.content,
            doc_type=data.doc_type,
        )
        self.db.add(doc)
        await self.db.flush()

        chunks = _chunk_text(data.content)
        embeddings = await self.embedder.embed_batch(chunks)

        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            doc_emb = DocumentEmbedding(
                document_id=doc.id,
                embedding=embedding,
                chunk_text=chunk,
                chunk_index=i,
            )
            self.db.add(doc_emb)

        await self.db.commit()
        await self.db.refresh(doc)
        logger.info(
            "Document %d created with %d chunks (embedding dim=%d)",
            doc.id, len(chunks), len(embeddings[0]) if embeddings else 0,
        )
        return DocumentRead.model_validate(doc)

    async def delete_document(self, doc_id: int) -> None:
        doc = await self.db.get(KnowledgeDocument, doc_id)
        if not doc:
            raise NotFoundError(f"Document {doc_id} not found")
        await self.db.delete(doc)
        await self.db.commit()
        logger.info("Document %d deleted", doc_id)

    async def list_documents(
        self, skip: int = 0, limit: int = 20
    ) -> list[DocumentRead]:
        result = await self.db.execute(
            select(KnowledgeDocument)
            .order_by(KnowledgeDocument.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        docs = result.scalars().all()
        return [DocumentRead.model_validate(d) for d in docs]

    async def reindex_all(self) -> int:
        result = await self.db.execute(select(KnowledgeDocument))
        docs = result.scalars().all()

        await self.db.execute(delete(DocumentEmbedding))

        total_chunks = 0
        for doc in docs:
            chunks = _chunk_text(doc.content)
            embeddings = await self.embedder.embed_batch(chunks)
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                doc_emb = DocumentEmbedding(
                    document_id=doc.id,
                    embedding=embedding,
                    chunk_text=chunk,
                    chunk_index=i,
                )
                self.db.add(doc_emb)
                total_chunks += 1

        await self.db.commit()
        logger.info(
            "Reindexed %d documents, %d chunks (provider=%s)",
            len(docs), total_chunks, type(self.embedder).__name__,
        )
        return total_chunks

    async def search_similar(
        self, query: str, limit: int = 5
    ) -> list[tuple[DocumentEmbedding, float]]:
        query_emb = await self.embedder.embed(query)

        result = await self.db.execute(
            select(DocumentEmbedding).options(
                selectinload(DocumentEmbedding.document)
            )
        )
        all_embeddings = result.scalars().all()

        scored: list[tuple[DocumentEmbedding, float]] = []
        for emb in all_embeddings:
            emb_list: list[float] = list(emb.embedding) if isinstance(emb.embedding, (list, tuple)) else []
            score = _cosine_similarity(query_emb, emb_list)
            scored.append((emb, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:limit]

    async def chat(self, query: str) -> ChatResponse:
        query_emb = await self.embedder.embed(query)

        result = await self.db.execute(
            select(DocumentEmbedding).options(
                selectinload(DocumentEmbedding.document)
            )
        )
        all_embeddings = result.scalars().all()

        scored: list[tuple[DocumentEmbedding, float]] = []
        for emb in all_embeddings:
            emb_list: list[float] = list(emb.embedding) if isinstance(emb.embedding, (list, tuple)) else []
            score = _cosine_similarity(query_emb, emb_list)
            scored.append((emb, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        top = scored[:5]

        if not top:
            return ChatResponse(answer="I don't have enough knowledge to answer that.", sources=[])

        context_parts: list[str] = []
        sources_set: set[str] = set()

        for emb, score in top:
            if emb.document:
                header = f"[Source: {emb.document.title}]"
                context_parts.append(f"{header}\n{emb.chunk_text}")
                sources_set.add(emb.document.title)

        context = "\n\n".join(context_parts)
        sources = list(sources_set)

        prompt = (
            "You are an AI assistant for a business copilot. "
            "Answer the user's question based on the provided context. "
            "If the context does not contain enough information, say so.\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            "Answer:"
        )

        try:
            from app.modules.ai.providers import get_ai_provider

            provider = get_ai_provider()
            answer = await provider.generate_completion(prompt=prompt)
        except Exception as e:
            logger.warning("LLM call failed, using fallback: %s", e)
            top_chunk = top[0][0].chunk_text if top else ""
            answer = f"Based on the knowledge base: {top_chunk[:300]}"

        return ChatResponse(answer=answer, sources=sources)