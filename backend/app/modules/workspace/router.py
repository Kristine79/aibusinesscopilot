from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.modules.auth.schemas import UserRead
from app.modules.auth.service import get_current_user
from app.modules.workspace.schemas import (
    AddMemberRequest,
    WorkspaceCreate,
    WorkspaceRead,
    WorkspaceMemberRead,
)
from app.modules.workspace.service import WorkspaceService

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.post("", response_model=WorkspaceRead, status_code=201)
async def create(
    data: WorkspaceCreate,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WorkspaceService(db)
    return await svc.create(data.name, user.id)


@router.get("", response_model=list[WorkspaceRead])
async def list_workspaces(
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WorkspaceService(db)
    return await svc.list_for_user(user.id)


@router.get("/{workspace_id}", response_model=WorkspaceRead)
async def get_workspace(
    workspace_id: int,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WorkspaceService(db)
    return await svc.get_by_id(workspace_id, user.id)


@router.post("/{workspace_id}/members", status_code=204)
async def add_member(
    workspace_id: int,
    data: AddMemberRequest,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WorkspaceService(db)
    await svc.add_member(workspace_id, user.id, data)


@router.delete(
    "/{workspace_id}/members/{target_user_id}", status_code=204
)
async def remove_member(
    workspace_id: int,
    target_user_id: int,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WorkspaceService(db)
    await svc.remove_member(workspace_id, user.id, target_user_id)


@router.get(
    "/{workspace_id}/members", response_model=list[WorkspaceMemberRead]
)
async def list_members(
    workspace_id: int,
    user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.modules.workspace.repository import WorkspaceRepository

    repo = WorkspaceRepository(db)
    members = await repo.list_members(workspace_id)
    return members
