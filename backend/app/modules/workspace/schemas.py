from datetime import datetime

from pydantic import BaseModel


class WorkspaceRead(BaseModel):
    id: int
    name: str
    created_at: datetime
    member_count: int = 0

    model_config = {"from_attributes": True}


class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceMemberRead(BaseModel):
    id: int
    user_id: int
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AddMemberRequest(BaseModel):
    user_id: int
    role: str = "member"
