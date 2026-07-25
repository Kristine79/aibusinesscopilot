import logging

from aiogram import Router, F
from aiogram.types import CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, Message

from bot.config import settings

logger = logging.getLogger(__name__)

router = Router()


@router.callback_query(F.data == "action_ask_question")
async def ask_question(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "💬 <b>Задать вопрос</b>\n\n"
        "Вы можете задать любой вопрос по вашему AI-анализу. "
        "Напишите его сюда, и я постараюсь помочь.\n\n"
        "Или посетите наш сайт для более детальной консультации:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="🌐 Перейти на сайт",
                        url=f"{settings.WEB_APP_URL}/diagnostic",
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="🔙 Назад",
                        callback_data="action_back_to_report",
                    )
                ],
            ]
        ),
    )
    await callback.answer()


@router.callback_query(F.data == "action_consultation")
async def get_consultation(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "📞 <b>Получить консультацию</b>\n\n"
        "Наши эксперты готовы помочь вам внедрить AI-решения "
        "в ваши бизнес-процессы.\n\n"
        "Для записи на бесплатную консультацию посетите наш сайт:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="🌐 Записаться на консультацию",
                        url=f"{settings.WEB_APP_URL}/diagnostic",
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="🔙 Назад",
                        callback_data="action_back_to_report",
                    )
                ],
            ]
        ),
    )
    await callback.answer()


@router.callback_query(F.data == "action_back_to_report")
async def back_to_report(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "✅ <b>AI Business Copilot</b>\n\n"
        "Используйте /start чтобы начать заново или "
        "пройдите диагностику на нашем сайте:",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="🌐 Пройти диагностику",
                        url=f"{settings.WEB_APP_URL}/diagnostic",
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="🚀 Начать заново",
                        callback_data="start_diagnostic",
                    )
                ],
            ]
        ),
    )
    await callback.answer()
