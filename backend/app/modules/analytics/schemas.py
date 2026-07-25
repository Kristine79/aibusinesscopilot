from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    total_users: int
    total_leads: int
    total_reports: int
    total_events: int
