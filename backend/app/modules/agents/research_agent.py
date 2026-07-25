import logging

from pydantic import BaseModel

from app.modules.agents.base import BaseAgent

logger = logging.getLogger(__name__)

RESEARCH_SYSTEM_PROMPT = """You are an AI industry research analyst. Research AI tools and best practices for the given business context. Respond with valid JSON matching the requested schema."""

RESEARCH_USER_PROMPT = """Research AI automation solutions for this business:

Business Type: {business_type}
Team Size: {team_size}
Problems: {problem_processes}
Current Tools: {tools}

Return a JSON object with:
- industry_trends: 3 key trends in this industry (trend, relevance, opportunity)
- recommended_tools: list of recommended AI tools (tool_name, category, description, pricing_tier, integration_ease)
- competitor_insights: how competitors are using AI (insight, source)
- implementation_pitfalls: common mistakes and how to avoid them (pitfall, prevention)
"""


class IndustryTrend(BaseModel):
    trend: str
    relevance: str
    opportunity: str


class RecommendedTool(BaseModel):
    tool_name: str
    category: str
    description: str
    pricing_tier: str
    integration_ease: str


class CompetitorInsight(BaseModel):
    insight: str
    source: str


class Pitfall(BaseModel):
    pitfall: str
    prevention: str


class ResearchOutput(BaseModel):
    industry_trends: list[IndustryTrend]
    recommended_tools: list[RecommendedTool]
    competitor_insights: list[CompetitorInsight]
    implementation_pitfalls: list[Pitfall]


class ResearchAgent(BaseAgent):
    name = "research"

    async def run(self, input_data: dict) -> dict:
        prompt = RESEARCH_USER_PROMPT.format(
            business_type=input_data.get("business_type", "unknown"),
            team_size=input_data.get("team_size", "unknown"),
            problem_processes=", ".join(input_data.get("problem_processes", [])),
            tools=", ".join(input_data.get("tools", [])),
        )
        result = await self.ai.generate_structured_response(
            prompt=prompt,
            response_schema=ResearchOutput,
            system_prompt=RESEARCH_SYSTEM_PROMPT,
        )
        return result.model_dump()
