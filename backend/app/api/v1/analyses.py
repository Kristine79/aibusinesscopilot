from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.ai.schemas import AnalyzeRequest, AnalyzeResponse, ReportRead
from app.modules.ai.service import AIService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{report_id}", response_model=ReportRead)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    service = AIService(db)
    return await service.get_report(report_id)


@router.get("", response_model=list[ReportRead])
async def list_reports(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    service = AIService(db)
    return await service.list_reports(skip=skip, limit=limit)


analyze_router = APIRouter(prefix="/analyze", tags=["analyze"])


@analyze_router.post("/{user_id}", response_model=AnalyzeResponse)
async def analyze_business(
    user_id: int,
    data: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
):
    service = AIService(db)
    return await service.analyze_business_profile(user_id, data)
