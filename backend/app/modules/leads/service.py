from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.core.exceptions import NotFoundError
from app.database.models.business_profile import BusinessProfile
from app.database.models.lead import Lead
from app.database.models.user import User
from app.modules.leads.repository import LeadRepository
from app.modules.leads.schemas import DiagnosticData, LeadCreate, LeadRead, LeadWithUser


class LeadService:
    def __init__(self, db: AsyncSession):
        self.repo = LeadRepository(db)
        self.db = db

    async def create_lead(self, data: LeadCreate) -> LeadRead:
        lead_data = {"user_id": data.user_id, "status": data.status}
        lead = await self.repo.create(lead_data)
        return LeadRead.model_validate(lead)

    async def get_lead(self, lead_id: int) -> LeadRead:
        lead = await self.repo.get_by_id(lead_id)
        if not lead:
            raise NotFoundError(f"Lead {lead_id} not found")
        return LeadRead.model_validate(lead)

    async def list_leads(self, skip: int = 0, limit: int = 20) -> list[LeadWithUser]:
        result = await self.db.execute(
            select(
                Lead.id,
                Lead.user_id,
                Lead.status,
                Lead.created_at,
                User.name.label("user_name"),
                User.email.label("user_email"),
                BusinessProfile.business_type,
                BusinessProfile.team_size,
            )
            .join(User, Lead.user_id == User.id)
            .join(BusinessProfile, BusinessProfile.user_id == User.id, isouter=True)
            .order_by(Lead.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        rows = result.all()
        return [
            LeadWithUser(
                id=row.id,
                user_id=row.user_id,
                status=row.status,
                created_at=row.created_at,
                user_name=row.user_name,
                user_email=row.user_email,
                business_type=row.business_type,
                team_size=row.team_size,
            )
            for row in rows
        ]

    async def update_lead_status(self, lead_id: int, status: str) -> LeadRead:
        lead = await self.repo.get_by_id(lead_id)
        if not lead:
            raise NotFoundError(f"Lead {lead_id} not found")
        lead.status = status
        await self.db.flush()
        await self.db.refresh(lead)
        return LeadRead.model_validate(lead)

    async def count(self) -> int:
        result = await self.db.execute(select(func.count(Lead.id)))
        return result.scalar() or 0

    async def submit_diagnostic(self, data: DiagnosticData) -> dict:
        user = User(
            name=data.name,
            email=data.email,
            telegram_username=data.telegram,
        )
        self.db.add(user)
        await self.db.flush()

        profile = BusinessProfile(
            user_id=user.id,
            company_name=data.name,
            business_type=data.business_type,
            team_size={"solo": 1, "2-5": 3, "5-20": 12, "20+": 30}.get(data.team_size, 1),
        )
        self.db.add(profile)
        await self.db.flush()

        lead = Lead(user_id=user.id, status="new")
        self.db.add(lead)
        await self.db.flush()

        return {
            "user_id": user.id,
            "lead_id": lead.id,
            "name": data.name,
            "email": data.email,
            "business_type": data.business_type,
            "team_size": data.team_size,
            "problem_processes": data.problem_processes,
            "tools": data.tools,
        }