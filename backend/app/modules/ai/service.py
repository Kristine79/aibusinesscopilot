import logging
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AIProviderError, NotFoundError
from app.database.models.automation_report import AutomationReport
from app.database.models.user import User
from app.modules.ai.providers import get_ai_provider
from app.modules.ai.schemas import (
    AnalysisResult,
    AnalyzeRequest,
    AnalyzeResponse,
    ReportRead,
)

logger = logging.getLogger(__name__)

ANALYSIS_SYSTEM_PROMPT = """You are an expert AI business analyst specializing in process automation.
Analyze the business profile and provide actionable automation recommendations.
Respond with valid JSON only, no markdown formatting."""

ANALYSIS_USER_PROMPT = """
Analyze this business for AI automation opportunities:

Business Type: {business_type}
Team Size: {team_size}
Problem Processes: {problem_processes}
Current Tools: {tools}

Provide a detailed analysis with:

1. Summary: Brief overview of the current state and automation potential

2. Opportunities: For each problem process, describe:
   - problem: What specific issue exists
   - solution: How AI can solve it
   - tools: What AI tools or technologies to use
   - time_saved: Estimated hours saved per week
   - priority: high/medium/low

3. Roadmap: 3-stage implementation plan:
   - stage: Name of the stage
   - actions: Concrete steps to take
   - duration: How long this stage takes

Return valid JSON matching this schema:
{{
  "summary": "string",
  "opportunities": [
    {{
      "problem": "string",
      "solution": "string",
      "tools": "string",
      "time_saved": "string",
      "priority": "high|medium|low"
    }}
  ],
  "roadmap": [
    {{
      "stage": "string",
      "actions": "string",
      "duration": "string"
    }}
  ]
}}
"""

BUSINESS_TYPES_MAP = {
    "ecommerce": "Интернет-магазин / E-commerce",
    "services": "Услуги / Services",
    "expert": "Эксперт / Expert",
    "agency": "Агентство / Agency",
    "education": "Образование / Education",
    "production": "Производство / Production",
}

TEAM_SIZE_MAP = {
    "solo": "1 человек",
    "2-5": "2-5 человек",
    "5-20": "5-20 человек",
    "20+": "20+ человек",
}

PROBLEM_PROCESSES_MAP = {
    "support": "Поддержка клиентов",
    "sales": "Продажи",
    "content": "Создание контента",
    "marketing": "Маркетинг",
    "analytics": "Аналитика",
    "documents": "Документооборот",
}

TOOLS_MAP = {
    "telegram": "Telegram",
    "crm": "CRM",
    "sheets": "Google Sheets",
    "notion": "Notion",
    "excel": "Excel",
}


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ai_provider = get_ai_provider()

    async def get_report(self, report_id: int) -> ReportRead:
        result = await self.db.execute(
            select(AutomationReport).where(AutomationReport.id == report_id)
        )
        report = result.scalar_one_or_none()
        if not report:
            raise NotFoundError(f"Report {report_id} not found")
        return ReportRead.model_validate(report)

    async def list_reports(self, skip: int = 0, limit: int = 20) -> list[ReportRead]:
        result = await self.db.execute(
            select(AutomationReport)
            .order_by(AutomationReport.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        reports = result.scalars().all()
        return [ReportRead.model_validate(r) for r in reports]

    async def analyze_business_profile(
        self, user_id: int, data: AnalyzeRequest
    ) -> AnalyzeResponse:
        user = await self.db.get(User, user_id)
        if not user:
            raise NotFoundError(f"User {user_id} not found")

        business_type_label = BUSINESS_TYPES_MAP.get(data.business_type, data.business_type)
        team_size_label = TEAM_SIZE_MAP.get(data.team_size, data.team_size)
        problem_processes_labels = [PROBLEM_PROCESSES_MAP.get(p, p) for p in data.problem_processes]
        tools_labels = [TOOLS_MAP.get(t, t) for t in data.tools]

        prompt = ANALYSIS_USER_PROMPT.format(
            business_type=business_type_label,
            team_size=team_size_label,
            problem_processes=", ".join(problem_processes_labels),
            tools=", ".join(tools_labels),
        )

        report = AutomationReport(
            user_id=user_id,
            report_json={"status": "processing"},
        )
        self.db.add(report)
        await self.db.flush()

        try:
            logger.info(
                "Starting AI analysis for user %d, provider=%s",
                user_id,
                settings.DEFAULT_AI_PROVIDER,
            )

            result: AnalysisResult = await self.ai_provider.generate_structured_response(
                prompt=prompt,
                response_schema=AnalysisResult,
                system_prompt=ANALYSIS_SYSTEM_PROMPT,
            )

            report.report_json = result.model_dump()
            logger.info("AI analysis completed for user %d", user_id)

        except Exception as e:
            report.report_json = {
                "status": "failed",
                "error": str(e),
            }
            await self.db.flush()
            logger.error("AI analysis failed for user %d: %s", user_id, str(e))
            raise AIProviderError(detail=f"AI analysis failed: {e}") from e

        await self.db.commit()
        await self.db.refresh(report)

        return AnalyzeResponse(
            id=report.id,
            user_id=report.user_id,
            report_json=AnalysisResult(**report.report_json),
            created_at=report.created_at,
        )
