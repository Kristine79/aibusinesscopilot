from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.business_profile import BusinessProfile
from app.database.models.user import User
from app.database.session import get_db

router = APIRouter(prefix="/users", tags=["users"])


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    telegram_username: str | None = None
    company_name: str | None = None
    business_type: str | None = None
    team_size: str | None = None


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    telegram_username: str | None = None

    model_config = {"from_attributes": True}


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    telegram_username: str | None = None
    company_name: str | None = None
    business_type: str | None = None
    team_size: str | None = None

    model_config = {"from_attributes": True}


@router.post("", response_model=UserRead, status_code=201)
async def create_user(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    user = User(
        name=data.name,
        email=data.email,
        telegram_username=data.telegram_username,
    )
    db.add(user)
    await db.flush()

    team_size_map = {"solo": 1, "2-5": 3, "5-20": 12, "20+": 25}
    if data.company_name or data.business_type or data.team_size:
        profile = BusinessProfile(
            user_id=user.id,
            company_name=data.company_name or "",
            business_type=data.business_type or "",
            team_size=team_size_map.get(data.team_size or "", 0),
        )
        db.add(profile)

    await db.commit()
    await db.refresh(user)
    return UserRead.model_validate(user)


@router.get("", response_model=list[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [UserRead.model_validate(u) for u in users]


@router.get("/{user_id}", response_model=UserProfile)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        from app.core.exceptions import NotFoundError
        raise NotFoundError(f"User {user_id} not found")

    profile_result = await db.execute(
        select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    )
    profile = profile_result.scalar_one_or_none()

    return UserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        telegram_username=user.telegram_username,
        company_name=profile.company_name if profile else None,
        business_type=profile.business_type if profile else None,
        team_size=str(profile.team_size) if profile else None,
    )


@router.get("/count/total")
async def count_users(
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import func
    result = await db.execute(select(func.count(User.id)))
    return {"total": result.scalar() or 0}
