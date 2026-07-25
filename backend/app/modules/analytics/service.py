from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.automation_report import AutomationReport
from app.database.models.analytics_event import AnalyticsEvent
from app.database.models.lead import Lead
from app.database.models.user import User
from app.modules.analytics.schemas import AnalyticsSummary


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_summary(self) -> AnalyticsSummary:
        total_users = (await self.db.execute(select(func.count(User.id)))).scalar() or 0
        total_leads = (await self.db.execute(select(func.count(Lead.id)))).scalar() or 0
        total_reports = (await self.db.execute(select(func.count(AutomationReport.id)))).scalar() or 0
        total_events = (await self.db.execute(select(func.count(AnalyticsEvent.id)))).scalar() or 0

        return AnalyticsSummary(
            total_users=total_users,
            total_leads=total_leads,
            total_reports=total_reports,
            total_events=total_events,
        )

    async def get_business_type_stats(self) -> list[dict]:
        from app.database.models.business_profile import BusinessProfile
        result = await self.db.execute(
            select(BusinessProfile.business_type, func.count(BusinessProfile.id))
            .group_by(BusinessProfile.business_type)
            .order_by(func.count(BusinessProfile.id).desc())
        )
        return [{"type": row[0], "count": row[1]} for row in result]
