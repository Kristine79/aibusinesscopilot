from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.diagnostic.models import DiagnosticSession


class DiagnosticRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self, user_id: int, session_data: dict, workspace_id: int | None = None
    ) -> DiagnosticSession:
        ds = DiagnosticSession(
            user_id=user_id,
            workspace_id=workspace_id,
            session_data=session_data,
        )
        self.db.add(ds)
        await self.db.flush()
        await self.db.refresh(ds)
        return ds

    async def get_by_id(self, session_id: int) -> DiagnosticSession | None:
        return await self.db.get(DiagnosticSession, session_id)

    async def list_by_user(self, user_id: int) -> list[DiagnosticSession]:
        result = await self.db.execute(
            select(DiagnosticSession)
            .where(DiagnosticSession.user_id == user_id)
            .order_by(DiagnosticSession.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_latest_by_user(self, user_id: int) -> DiagnosticSession | None:
        result = await self.db.execute(
            select(DiagnosticSession)
            .where(DiagnosticSession.user_id == user_id)
            .order_by(DiagnosticSession.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()
