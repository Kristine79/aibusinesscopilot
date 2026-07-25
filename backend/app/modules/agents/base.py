import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.ai.providers import get_ai_provider
from app.modules.agents.models import AgentRun

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    name: str = "base"

    def __init__(self, db: AsyncSession, user_id: int, workspace_id: int | None = None):
        self.db = db
        self.user_id = user_id
        self.workspace_id = workspace_id
        self.ai = get_ai_provider()

    @abstractmethod
    async def run(self, input_data: dict) -> dict:
        ...

    async def execute(self, input_data: dict) -> AgentRun:
        run = AgentRun(
            user_id=self.user_id,
            workspace_id=self.workspace_id,
            agent_name=self.name,
            input_data=input_data,
            status="running",
            started_at=datetime.now(timezone.utc),
        )
        self.db.add(run)
        await self.db.flush()

        try:
            result = await self.run(input_data)
            run.output_data = result
            run.status = "completed"
            run.completed_at = datetime.now(timezone.utc)
        except Exception as e:
            run.status = "failed"
            run.error = str(e)[:500]
            run.completed_at = datetime.now(timezone.utc)
            logger.error("Agent %s failed: %s", self.name, e)

        await self.db.flush()
        return run
