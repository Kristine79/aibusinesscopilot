import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.knowledge.schemas import ChatQuery, ChatResponse, DocumentCreate, DocumentRead
from app.modules.knowledge.service import KnowledgeService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.post("/documents", response_model=DocumentRead, status_code=201)
async def create_document(
    data: DocumentCreate,
    db: AsyncSession = Depends(get_db),
):
    service = KnowledgeService(db)
    return await service.create_document(data)


@router.get("/documents", response_model=list[DocumentRead])
async def list_documents(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    service = KnowledgeService(db)
    return await service.list_documents(skip=skip, limit=limit)


@router.delete("/documents/{doc_id}", status_code=204)
async def delete_document(
    doc_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = KnowledgeService(db)
    await service.delete_document(doc_id)


@router.post("/reindex")
async def reindex_documents(
    db: AsyncSession = Depends(get_db),
):
    service = KnowledgeService(db)
    total_chunks = await service.reindex_all()
    return {"message": "Reindex complete", "total_chunks": total_chunks}


@router.post("/chat", response_model=ChatResponse)
async def chat_query(
    query: ChatQuery,
    db: AsyncSession = Depends(get_db),
):
    service = KnowledgeService(db)
    return await service.chat(query.message)
