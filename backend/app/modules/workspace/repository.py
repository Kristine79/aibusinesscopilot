from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.workspace.models import Workspace, WorkspaceMember


class WorkspaceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, name: str) -> Workspace:
        ws = Workspace(name=name)
        self.db.add(ws)
        await self.db.flush()
        await self.db.refresh(ws)
        return ws

    async def get_by_id(self, workspace_id: int) -> Workspace | None:
        return await self.db.get(Workspace, workspace_id)

    async def list_for_user(self, user_id: int) -> list[Workspace]:
        result = await self.db.execute(
            select(Workspace)
            .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
            .where(WorkspaceMember.user_id == user_id)
        )
        return list(result.scalars().all())

    async def add_member(
        self, workspace_id: int, user_id: int, role: str = "member"
    ) -> WorkspaceMember:
        m = WorkspaceMember(workspace_id=workspace_id, user_id=user_id, role=role)
        self.db.add(m)
        await self.db.flush()
        return m

    async def get_member(
        self, workspace_id: int, user_id: int
    ) -> WorkspaceMember | None:
        result = await self.db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def remove_member(self, workspace_id: int, user_id: int) -> None:
        m = await self.get_member(workspace_id, user_id)
        if m:
            await self.db.delete(m)
            await self.db.flush()

    async def count_members(self, workspace_id: int) -> int:
        result = await self.db.execute(
            select(func.count(WorkspaceMember.id)).where(
                WorkspaceMember.workspace_id == workspace_id
            )
        )
        return result.scalar() or 0

    async def list_members(self, workspace_id: int) -> list[WorkspaceMember]:
        result = await self.db.execute(
            select(WorkspaceMember).where(
                WorkspaceMember.workspace_id == workspace_id
            )
        )
        return list(result.scalars().all())
