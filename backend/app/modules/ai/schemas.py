from datetime import datetime

from pydantic import BaseModel


class OpportunityItem(BaseModel):
    problem: str
    solution: str
    tools: str
    time_saved: str
    priority: str


class RoadmapItem(BaseModel):
    stage: str
    actions: str
    duration: str


class AnalysisResult(BaseModel):
    summary: str
    opportunities: list[OpportunityItem]
    roadmap: list[RoadmapItem]


class AnalyzeRequest(BaseModel):
    name: str
    email: str
    business_type: str
    team_size: str
    problem_processes: list[str]
    tools: list[str]


class AnalyzeResponse(BaseModel):
    id: int
    user_id: int
    report_json: AnalysisResult
    created_at: datetime


class ReportRead(BaseModel):
    id: int
    user_id: int
    lead_id: int | None = None
    report_json: dict
    created_at: datetime

    model_config = {"from_attributes": True}

class ReportIdResponse(BaseModel):
    report_id: int
    user_id: int
    analysis: AnalysisResult