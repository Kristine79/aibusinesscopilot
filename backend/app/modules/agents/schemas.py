from datetime import datetime

from pydantic import BaseModel


class AgentRunRead(BaseModel):
    id: int
    session_id: int | None = None
    user_id: int
    workspace_id: int | None = None
    agent_name: str
    status: str
    error: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AgentResult(BaseModel):
    agent_name: str
    status: str
    output: dict
    error: str | None = None


class OrchestratorResult(BaseModel):
    session_id: int | None = None
    agent_results: list[AgentResult]
    summary: str


class AnalyzeWithAgentsRequest(BaseModel):
    user_id: int
    session_id: int | None = None
