import logging

from pydantic import BaseModel

from app.modules.agents.base import BaseAgent

logger = logging.getLogger(__name__)

STRATEGY_SYSTEM_PROMPT = """You are a senior AI automation strategist. Analyze the business context and create a comprehensive automation roadmap. Respond with valid JSON matching the requested schema."""

STRATEGY_USER_PROMPT = """Create an automation strategy for this business:

Business Type: {business_type}
Team Size: {team_size}
Problems: {problem_processes}
Current Tools: {tools}

Return a JSON object with:
- vision: 2-3 sentence automation vision for this business
- quick_wins: list of 3 immediate opportunities (name, impact, effort, time_to_implement)
- roadmap: list of phases (phase_name, duration, key_initiatives)
- kpis: list of KPIs to track (metric_name, current_value, target_value, measurement_method)
- risks: list of risks (risk, mitigation)
"""


class QuickWin(BaseModel):
    name: str
    impact: str
    effort: str
    time_to_implement: str


class RoadmapPhase(BaseModel):
    phase_name: str
    duration: str
    key_initiatives: str


class KPI(BaseModel):
    metric_name: str
    current_value: str
    target_value: str
    measurement_method: str


class Risk(BaseModel):
    risk: str
    mitigation: str


class StrategyOutput(BaseModel):
    vision: str
    quick_wins: list[QuickWin]
    roadmap: list[RoadmapPhase]
    kpis: list[KPI]
    risks: list[Risk]


class StrategyAgent(BaseAgent):
    name = "strategy"

    async def run(self, input_data: dict) -> dict:
        prompt = STRATEGY_USER_PROMPT.format(
            business_type=input_data.get("business_type", "unknown"),
            team_size=input_data.get("team_size", "unknown"),
            problem_processes=", ".join(input_data.get("problem_processes", [])),
            tools=", ".join(input_data.get("tools", [])),
        )
        result = await self.ai.generate_structured_response(
            prompt=prompt,
            response_schema=StrategyOutput,
            system_prompt=STRATEGY_SYSTEM_PROMPT,
        )
        return result.model_dump()
