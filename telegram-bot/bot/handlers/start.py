import logging

from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, Message

logger = logging.getLogger(__name__)

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    await message.answer(
        "🤖 <b>AI Business Copilot</b>\n\n"
        "Я AI Business Copilot. Помогу найти процессы вашего бизнеса, "
        "которые можно улучшить с помощью AI.",
        parse_mode="HTML",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="🚀 Начать диагностику",
                        callback_data="start_diagnostic",
                    )
                ]
            ]
        ),
    )
