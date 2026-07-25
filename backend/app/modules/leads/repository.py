from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.lead import Lead


class LeadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Lead:
        lead = Lead(**data)
        self.db.add(lead)
        await self.db.flush()
        await self.db.refresh(lead)
        return lead

    async def get_by_id(self, lead_id: int) -> Lead | None:
        result = await self.db.execute(select(Lead).where(Lead.id == lead_id))
        return result.scalar_one_or_none()

    async def list(self, skip: int = 0, limit: int = 20) -> list[Lead]:
        result = await self.db.execute(
            select(Lead).order_by(Lead.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def count(self) -> int:
        result = await self.db.execute(select(func.count(Lead.id)))
        return result.scalar() or 0
