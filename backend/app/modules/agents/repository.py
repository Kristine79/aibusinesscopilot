from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agents.models import AgentRun


class AgentRunRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_by_user(self, user_id: int) -> list[AgentRun]:
        result = await self.db.execute(
            select(AgentRun)
            .where(AgentRun.user_id == user_id)
            .order_by(AgentRun.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, run_id: int) -> AgentRun | None:
        return await self.db.get(AgentRun, run_id)

    async def list_by_session(self, session_id: int) -> list[AgentRun]:
        result = await self.db.execute(
            select(AgentRun)
            .where(AgentRun.session_id == session_id)
            .order_by(AgentRun.created_at.asc())
        )
        return list(result.scalars().all())
