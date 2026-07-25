from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, NotFoundError
from app.database.session import get_db
from app.modules.auth.schemas import UserRead
from app.modules.auth.service import get_current_user
from app.modules.workspace.repository import WorkspaceRepository
from app.modules.workspace.schemas import (
    AddMemberRequest,
    WorkspaceCreate,
    WorkspaceRead,
)


def workspace_repo(db: AsyncSession = Depends(get_db)) -> WorkspaceRepository:
    return WorkspaceRepository(db)


class WorkspaceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = WorkspaceRepository(db)

    async def create(self, name: str, owner_id: int) -> WorkspaceRead:
        ws = await self.repo.create(name)
        await self.repo.add_member(ws.id, owner_id, "admin")
        await self.db.commit()
        members = await self.repo.count_members(ws.id)
        result = WorkspaceRead.model_validate(ws)
        result.member_count = members
        return result

    async def list_for_user(self, user_id: int) -> list[WorkspaceRead]:
        workspaces = await self.repo.list_for_user(user_id)
        results = []
        for ws in workspaces:
            r = WorkspaceRead.model_validate(ws)
            r.member_count = await self.repo.count_members(ws.id)
            results.append(r)
        return results

    async def get_by_id(self, workspace_id: int, user_id: int) -> WorkspaceRead:
        ws = await self.repo.get_by_id(workspace_id)
        if not ws:
            raise NotFoundError("Workspace not found")
        member = await self.repo.get_member(workspace_id, user_id)
        if not member:
            raise ForbiddenError("Not a member of this workspace")
        result = WorkspaceRead.model_validate(ws)
        result.member_count = await self.repo.count_members(ws.id)
        return result

    async def add_member(
        self, workspace_id: int, actor_id: int, data: AddMemberRequest
    ) -> None:
        actor = await self.repo.get_member(workspace_id, actor_id)
        if not actor or actor.role not in ("admin",):
            raise ForbiddenError("Only admins can add members")
        existing = await self.repo.get_member(workspace_id, data.user_id)
        if existing:
            return
        await self.repo.add_member(workspace_id, data.user_id, data.role)
        await self.db.commit()

    async def remove_member(
        self, workspace_id: int, actor_id: int, target_user_id: int
    ) -> None:
        actor = await self.repo.get_member(workspace_id, actor_id)
        if not actor or actor.role not in ("admin",):
            raise ForbiddenError("Only admins can remove members")
        await self.repo.remove_member(workspace_id, target_user_id)
        await self.db.commit()
