from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.leads.schemas import DiagnosticData, LeadCreate, LeadRead, LeadUpdate, LeadWithUser
from app.modules.leads.service import LeadService

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadRead, status_code=201)
async def create_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
):
    service = LeadService(db)
    return await service.create_lead(data)


@router.post("/diagnostic", status_code=201)
async def submit_diagnostic(
    data: DiagnosticData,
    db: AsyncSession = Depends(get_db),
):
    service = LeadService(db)
    return await service.submit_diagnostic(data)


@router.get("", response_model=list[LeadWithUser])
async def list_leads(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    service = LeadService(db)
    return await service.list_leads(skip=skip, limit=limit)


@router.patch("/{lead_id}", response_model=LeadRead)
async def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
):
    service = LeadService(db)
    return await service.update_lead_status(lead_id, data.status)