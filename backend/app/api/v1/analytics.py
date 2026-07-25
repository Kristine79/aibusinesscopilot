from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.analytics.service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
async def get_analytics_summary(
    db: AsyncSession = Depends(get_db),
):
    service = AnalyticsService(db)
    return await service.get_summary()


@router.get("/business-types")
async def get_business_type_stats(
    db: AsyncSession = Depends(get_db),
):
    service = AnalyticsService(db)
    return await service.get_business_type_stats()
