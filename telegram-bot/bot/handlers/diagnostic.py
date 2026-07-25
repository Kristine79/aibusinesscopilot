import logging

import httpx
from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, Message

from bot.config import settings

logger = logging.getLogger(__name__)

router = Router()


class DiagnosticStates(StatesGroup):
    name = State()
    business_type = State()
    problem_processes = State()


BUSINESS_TYPES = {
    "ecommerce": "🛒 E-commerce",
    "services": "💼 Услуги",
    "expert": "🎓 Эксперт",
    "agency": "🏢 Агентство",
    "education": "📚 Образование",
    "manufacturing": "🏭 Производство",
}

BUSINESS_KEYBOARD = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="🛒 E-commerce", callback_data="biz_ecommerce"),
            InlineKeyboardButton(text="💼 Услуги", callback_data="biz_services"),
        ],
        [
            InlineKeyboardButton(text="🎓 Эксперт", callback_data="biz_expert"),
            InlineKeyboardButton(text="🏢 Агентство", callback_data="biz_agency"),
        ],
        [
            InlineKeyboardButton(text="📚 Образование", callback_data="biz_education"),
            InlineKeyboardButton(text="🏭 Производство", callback_data="biz_manufacturing"),
        ],
    ]
)


@router.callback_query(F.data == "start_diagnostic")
async def start_diagnostic(callback: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(DiagnosticStates.name)
    await callback.message.edit_text(
        "Давайте начнём диагностику! 🚀\n\nКак вас <b>зовут</b>?",
        parse_mode="HTML",
    )
    await callback.answer()


@router.message(DiagnosticStates.name)
async def process_name(message: Message, state: FSMContext) -> None:
    if not message.text or len(message.text.strip()) < 2:
        await message.answer("Пожалуйста, введите ваше имя (минимум 2 символа):")
        return

    name = message.text.strip()
    await state.update_data(name=name)
    await state.set_state(DiagnosticStates.business_type)

    await message.answer(
        f"Приятно познакомиться, {name}! 👋\n\n"
        "Выберите <b>тип вашего бизнеса</b>:",
        parse_mode="HTML",
        reply_markup=BUSINESS_KEYBOARD,
    )


@router.callback_query(DiagnosticStates.business_type, F.data.startswith("biz_"))
async def process_business_type(callback: CallbackQuery, state: FSMContext) -> None:
    biz_key = callback.data.replace("biz_", "")
    biz_label = BUSINESS_TYPES.get(biz_key, biz_key)

    await state.update_data(business_type=biz_key)
    await state.set_state(DiagnosticStates.problem_processes)

    await callback.message.edit_text(
        f"Отлично, {biz_label}! 🎯\n\n"
        "Теперь расскажите <b>о сфере деятельности</b> вашей компании.\n\n"
        "Например: «IT-аутсорсинг для банков», "
        "«Розничная торговля одеждой», "
        "«Юридические услуги для малого бизнеса».",
        parse_mode="HTML",
    )
    await callback.answer()


@router.message(DiagnosticStates.problem_processes)
async def process_problem_processes(message: Message, state: FSMContext) -> None:
    if not message.text or len(message.text.strip()) < 3:
        await message.answer("Пожалуйста, опишите сферу деятельности подробнее (минимум 3 символа):")
        return

    sphere = message.text.strip()
    await state.update_data(problem_processes=sphere)

    await message.answer("⏳ Создаю ваш профиль и запускаю AI-анализ...")

    data = await state.get_data()

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            user_res = await client.post(
                f"{settings.BACKEND_API_URL}/users",
                json={
                    "name": data["name"],
                    "email": f"{message.from_user.id}@telegram.user",
                    "telegram_username": message.from_user.username or "",
                    "company_name": sphere,
                    "business_type": data["business_type"],
                    "team_size": "solo",
                },
            )
            user_res.raise_for_status()
            user = user_res.json()
            user_id = user["id"]
            logger.info("User created: id=%s name=%s", user_id, data["name"])

            lead_res = await client.post(
                f"{settings.BACKEND_API_URL}/leads",
                json={
                    "user_id": user_id,
                    "status": "new",
                    "business_type": data["business_type"],
                    "problem_processes": [sphere],
                    "team_size": "solo",
                    "tools": [],
                },
            )
            lead_res.raise_for_status()
            lead = lead_res.json()
            lead_id = lead["id"]
            logger.info("Lead created: id=%s", lead_id)

            analyze_res = await client.post(
                f"{settings.BACKEND_API_URL}/analyze/{user_id}",
                json={
                    "name": data["name"],
                    "email": f"{message.from_user.id}@telegram.user",
                    "business_type": data["business_type"],
                    "team_size": "solo",
                    "problem_processes": [sphere],
                    "tools": [],
                },
            )
            analyze_res.raise_for_status()
            report = analyze_res.json()
            report_id = report.get("id") or report.get("report_id")
            logger.info("Analysis completed: report_id=%s", report_id)

            await state.update_data(
                user_id=user_id,
                lead_id=lead_id,
                report_id=report_id,
            )

            summary = (report.get("report_json") or report.get("analysis", {})).get("summary", "")

            await message.answer(
                "🌐 <b>Пройдите веб-диагностику</b>\n\n"
                "Для более детального анализа заполните анкету на нашем сайте:",
                parse_mode="HTML",
                reply_markup=InlineKeyboardMarkup(
                    inline_keyboard=[
                        [
                            InlineKeyboardButton(
                                text="🌐 Пройти веб-диагностику",
                                url=f"{settings.WEB_APP_URL}/diagnostic",
                            )
                        ]
                    ]
                ),
            )

            buttons = [
                [
                    InlineKeyboardButton(
                        text="📊 Открыть отчёт",
                        url=f"{settings.WEB_APP_URL}/report/{report_id}",
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="💬 Задать вопрос",
                        callback_data="action_ask_question",
                    ),
                    InlineKeyboardButton(
                        text="📞 Получить консультацию",
                        callback_data="action_consultation",
                    ),
                ],
            ]

            result_text = "✅ <b>Ваш AI-анализ готов!</b>\n\n"
            if summary:
                result_text += f"{summary[:500]}\n\n"
            result_text += "Нажмите кнопку ниже, чтобы открыть полный отчёт."

            await message.answer(
                result_text,
                parse_mode="HTML",
                reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons),
            )

    except httpx.HTTPStatusError as exc:
        logger.error("HTTP error during diagnostic: %s", exc)
        await message.answer(
            "❌ Произошла ошибка при обработке запроса. "
            f"Пожалуйста, попробуйте позже.\n\n"
            f"Или пройдите диагностику на сайте: {settings.WEB_APP_URL}/diagnostic"
        )
    except httpx.RequestError as exc:
        logger.error("Network error during diagnostic: %s", exc)
        await message.answer(
            "❌ Не удалось соединиться с сервером. "
            "Пожалуйста, попробуйте позже."
        )
    except Exception:
        logger.exception("Unexpected error during diagnostic")
        await message.answer(
            "❌ Произошла непредвиденная ошибка. "
            f"Попробуйте позже или пройдите диагностику на сайте: "
            f"{settings.WEB_APP_URL}/diagnostic"
        )

    await state.clear()
