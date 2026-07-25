import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agents.base import BaseAgent
from app.modules.agents.models import AgentRun
from app.modules.agents.research_agent import ResearchAgent
from app.modules.agents.schemas import AgentResult, OrchestratorResult
from app.modules.agents.strategy_agent import StrategyAgent

logger = logging.getLogger(__name__)


AGENTS: list[type[BaseAgent]] = [StrategyAgent, ResearchAgent]


class Orchestrator:
    def __init__(self, db: AsyncSession, user_id: int, workspace_id: int | None = None):
        self.db = db
        self.user_id = user_id
        self.workspace_id = workspace_id
        self.results: list[AgentResult] = []

    async def run_all(self, input_data: dict) -> OrchestratorResult:
        for agent_cls in AGENTS:
            agent = agent_cls(
                db=self.db,
                user_id=self.user_id,
                workspace_id=self.workspace_id,
            )
            logger.info("Running agent: %s", agent.name)
            run = await agent.execute(input_data)
            self.results.append(
                AgentResult(
                    agent_name=agent.name,
                    status=run.status,
                    output=run.output_data,
                    error=run.error,
                )
            )

        await self.db.commit()

        summary_parts = []
        for r in self.results:
            status = "✓" if r.status == "completed" else "✗"
            summary_parts.append(f"{status} {r.agent_name}")
        summary = " | ".join(summary_parts)

        return OrchestratorResult(
            agent_results=self.results,
            summary=summary,
        )
