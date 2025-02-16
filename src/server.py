from flask import Flask, render_template, send_from_directory, request, jsonify
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from aiogram.filters import Command
from aiogram import F
from threading import Thread
from db_utils import add_user, get_user, update_user_coins

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
    return render_template('index.html', username="Guest", user_id=0)


@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../src', filename)


@app.route('/assets/<path:filename>')
def assets_files(filename):
    return send_from_directory('../src/assets', filename)


# Новый роут для рендеринга шаблона с именем пользователя
@app.route('/user/<username>')
def user(username):
    user_id = request.args.get('user_id', 0)  # Динамическая передача user_id
    return render_template('index.html', username=username, user_id=user_id)


@app.route('/update_coins', methods=['POST'])
def update_coins():
    try:
        data = request.get_json()
        user_id = request.headers.get('User-ID')
        coins = data.get('coins')
        print(f"Received data: user_id={user_id}, coins={coins}")

        if not user_id or coins is None:
            error_msg = "Invalid data: Missing user_id or coins"
            print(error_msg)
            return jsonify(success=False, error=error_msg), 400

        user_id = int(user_id)
        coins = int(coins)

        update_user_coins(user_id, coins)
        return jsonify(success=True)

    except Exception as e:
        print(f"Error in /update_coins: {e}")
        return jsonify(success=False, error=str(e)), 500


@app.route('/update_profit_per_hour', methods=['POST'])
def update_profit_per_hour():
    try:
        data = request.get_json()
        user_id = request.headers.get('User-ID')
        profit_per_hour = data.get('profit_per_hour')

        if not user_id or profit_per_hour is None:
            return jsonify(success=False, error="Invalid data"), 400

        update_profit_per_hour(int(user_id), float(profit_per_hour))
        return jsonify(success=True)
    except Exception as e:
        print(f"Error in /update_profit_per_hour: {e}")
        return jsonify(success=False, error=str(e)), 500


# === Telegram-бот: Обработчики ===
@dp.message(Command("start"))
async def start(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name or "User"
    ref_link = f"https://5319-2a0d-5600-44-5000-00-4e6b.ngrok-free.app/{user_id}"  # Генерация реферальной ссылки
    web_app_url = f"https://5319-2a0d-5600-44-5000-00-4e6b.ngrok-free.app/user/{username}?user_id={user_id}"  # URL вашего Flask-сервера с именем пользователя

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
