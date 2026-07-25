from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr

BusinessType = Literal[
    "ecommerce", "services", "expert", "agency", "education", "manufacturing"
]

TeamSize = Literal["solo", "2-5", "5-20", "20+"]

ProblemProcess = Literal[
    "support", "sales", "content", "marketing", "analytics", "documents"
]

Tool = Literal["telegram", "crm", "sheets", "notion", "excel"]


class DiagnosticData(BaseModel):
    name: str
    email: EmailStr
    telegram: str | None = None
    business_type: BusinessType
    team_size: TeamSize
    problem_processes: list[ProblemProcess]
    tools: list[Tool]


class LeadCreate(BaseModel):
    user_id: int
    status: str = "new"
    business_type: str | None = None
    team_size: str | None = None
    problem_processes: list[str] | None = None
    tools: list[str] | None = None


class LeadRead(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LeadWithUser(BaseModel):
    id: int
    user_id: int
    status: str
    created_at: datetime
    user_name: str | None = None
    user_email: str | None = None
    business_type: str | None = None
    team_size: int | None = None

    model_config = {"from_attributes": True}


class LeadUpdate(BaseModel):
    status: str | None = None