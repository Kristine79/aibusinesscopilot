from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.agents.orchestrator import Orchestrator
from app.modules.agents.repository import AgentRunRepository
from app.modules.agents.schemas import AgentRunRead, OrchestratorResult
from app.modules.auth.schemas import UserRead
from app.modules.auth.service import get_current_user

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/analyze", response_model=OrchestratorResult)
async def analyze_with_agents(
    input_data: dict,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    orch = Orchestrator(db, user.id)
    return await orch.run_all(input_data)


@router.get("/runs", response_model=list[AgentRunRead])
async def list_runs(
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = AgentRunRepository(db)
    return await repo.list_by_user(user.id)


@router.get("/runs/{run_id}", response_model=AgentRunRead)
async def get_run(
    run_id: int,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    repo = AgentRunRepository(db)
    run = await repo.get_by_id(run_id)
    return run
