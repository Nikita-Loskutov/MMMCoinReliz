from flask import Flask, render_template, send_from_directory
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.filters import Command
from aiogram import F
from threading import Thread
from db_utils import add_user, get_user, update_user_coins
from flask import request, jsonify

# === Настройки Telegram-бота ===
TOKEN = '7930529716:AAF5TYEKKTsG_jUD3k0gtzIa3YvAfikUIdk'

bot = Bot(token=TOKEN)
dp = Dispatcher()

# === Настройки Flask-сервера ===
app = Flask(__name__, static_folder='../src', template_folder='../src')

# === Роуты Flask ===
@app.route('/')
def index():
    # Отображение главной страницы с дефолтным именем пользователя
    return render_template('index.html', username="Guest")

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../src', filename)

@app.route('/assets/<path:filename>')
def assets_files(filename):
    return send_from_directory('../src/assets', filename)

# Новый роут для рендеринга шаблона с именем пользователя
@app.route('/user/<username>')
def user(username):
    return render_template('index.html', username=username)


@app.route('/update_coins', methods=['POST'])
def update_coins():
    data = request.get_json()
    user_id = request.headers.get('user_id')
    coins = data.get('coins')
    update_user_coins(user_id, coins)
    return jsonify(success=True)

@app.route('/update_profit_per_hour', methods=['POST'])
def update_profit_per_hour():
    data = request.get_json()
    user_id = request.headers.get('User-ID')
    profit_per_hour = data.get('profit_per_hour')
    update_profit_per_hour(user_id, profit_per_hour)
    return jsonify(success=True)

# === Telegram-бот: Обработчики ===
@dp.message(Command("start"))
async def start(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name or "User"
    ref_link = f"https://6e3c-2a0d-5600-44-5000-00-5a2.ngrok-free.app/{user_id}"  # Генерация реферальной ссылки
    web_app_url = f"https://6e3c-2a0d-5600-44-5000-00-5a2.ngrok-free.app/user/{username}"  # URL вашего Flask-сервера с именем пользователя

    # Добавляем пользователя в базу данных
    if not get_user(user_id):
        add_user(user_id, username, ref_link)

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text='Играть в 1 клик 🎮', web_app=WebAppInfo(url=web_app_url))],
        [InlineKeyboardButton(text='Подписаться на канал 📢', url='https://t.me/your_channel')],
        [InlineKeyboardButton(text='Как заработать на игре 💰', callback_data='how_to_earn')]
    ])

    await message.answer(
        "Привет! Добро пожаловать в MMM Coin 🎮!\n"
        "Отныне ты — директор криптобиржи. Какой? Выбирай сам. Тапай по экрану, собирай монеты, качай пассивный доход.\n"
        "Твоя реферальная ссылка: " + ref_link,
        reply_markup=keyboard
    )


@dp.callback_query(F.data.in_({'how_to_earn'}))
async def button_handler(callback_query: types.CallbackQuery):
    if callback_query.data == 'how_to_earn':
        await bot.send_message(callback_query.from_user.id, "Чтобы заработать, приглашай друзей и получай бонусы!")
    await callback_query.answer()

# === Запуск Telegram-бота ===
async def telegram_main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

# === Запуск Flask и Telegram параллельно ===
def run_flask():
    app.run(host='0.0.0.0', port=5000, use_reloader=False)

if __name__ == '__main__':
    # Flask запускается в отдельном потоке
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Telegram запускается в основном asyncio-событии
    asyncio.run(telegram_main())