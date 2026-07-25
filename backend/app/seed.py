import asyncio
import logging

from app.database.base import Base
from app.database.models.user import User
from app.database.models.business_profile import BusinessProfile
from app.database.models.lead import Lead
from app.database.models.automation_report import AutomationReport
from app.database.session import async_session_factory, engine

logger = logging.getLogger(__name__)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        existing = await session.get(User, 1)
        if existing:
            logger.info("Seed data already exists, skipping")
            return

        user = User(
            id=1,
            name="Алексей Иванов",
            email="alexey@example.com",
            telegram_username="@alexey_ai",
        )
        session.add(user)

        profile = BusinessProfile(
            user_id=1,
            company_name="ООО Технологии Будущего",
            business_type="it_services",
            team_size=15,
        )
        session.add(profile)

        lead = Lead(user_id=1, status="new")
        session.add(lead)

        report = AutomationReport(
            user_id=1,
            lead_id=1,
            report_json={
                "summary": "Ручная обработка заказов в CRM",
                "opportunities": [
                    {
                        "title": "Автоматизация ввода заказов",
                        "impact": "high",
                        "description": "Использовать AI для распознавания входящих заявок",
                    },
                    {
                        "title": "Чат-бот для клиентов",
                        "impact": "medium",
                        "description": "Внедрить бота для ответов на типовые вопросы",
                    },
                ],
                "recommendations": [
                    "Интегрировать OpenAI API для классификации заявок",
                    "Настроить автоматическую маршрутизацию задач",
                ],
                "automation_potential": "high",
            },
        )
        session.add(report)

        await session.commit()
        logger.info("Seed data created successfully")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed())
