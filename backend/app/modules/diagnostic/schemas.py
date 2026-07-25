from datetime import datetime

from pydantic import BaseModel


class DiagnosticSessionRead(BaseModel):
    id: int
    user_id: int
    workspace_id: int | None = None
    session_data: dict
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
