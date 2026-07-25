from datetime import datetime

from pydantic import BaseModel


class DocumentCreate(BaseModel):
    title: str
    content: str
    doc_type: str = "markdown"

    model_config = {
        "json_schema_extra": {
            "max_length": {
                "title": 512,
            }
        }
    }


class DocumentRead(BaseModel):
    id: int
    title: str
    content: str
    doc_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentEmbeddingRead(BaseModel):
    id: int
    document_id: int
    chunk_text: str
    chunk_index: int

    model_config = {"from_attributes": True}


class ChatQuery(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
