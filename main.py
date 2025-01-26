import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.filters import Command
from aiogram import F

TOKEN = '7930529716:AAF5TYEKKTsG_jUD3k0gtzIa3YvAfikUIdk'

# Создаем объект бота
bot = Bot(token=TOKEN)
# Создаем объект диспетчера
dp = Dispatcher()


# Стартовая команда
@dp.message(Command("start"))
async def start(message: types.Message):
    username = message.from_user.username or message.from_user.first_name or "User"
    web_app_url = f"https://mmm-coin.web.app/"  # Замените на URL вашего веб-приложения

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text='Играть в 1 клик 🎮', web_app=WebAppInfo(url=web_app_url))],
        [InlineKeyboardButton(text='Подписаться на канал 📢', url='https://t.me/your_channel')],
        [InlineKeyboardButton(text='Как заработать на игре 💰', callback_data='how_to_earn')]
    ])

    await message.answer(
        "Привет! Добро пожаловать в MMM Coin 🎮!\n"
        "Отныне ты — директор криптобиржи. Какой? Выбирай сам. Тапай по экрану, собирай монеты, качай пассивный доход, разрабатывай собственную стратегию дохода. Мы в свою очередь оценим это во время листинга токена, даты которого ты узнаешь совсем скоро. Про друзей не забывай — зови их в игру и получайте вместе ещё больше монет!",
        reply_markup=keyboard
    )


# Обработка нажатий кнопок
@dp.callback_query(F.data.in_({'how_to_earn'}))
async def button_handler(callback_query: types.CallbackQuery):
    if callback_query.data == 'how_to_earn':
        await bot.send_message(callback_query.from_user.id, "Чтобы заработать, приглашай друзей и получай бонусы!")
    await callback_query.answer()


# Основная функция
async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())



from token import TOKEN