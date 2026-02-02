
import telebot
from telebot import types

# 1. ТОКЕН И ИНИЦИАЛИЗАЦИЯ
TOKEN = '8529654935:AAH-2XvgJAabbzXOx5J0dGrFNASYue7breg'
bot = telebot.TeleBot(TOKEN)

# База данных игроков
players = {}

# --- БАЗА ДАННЫХ СИТУАЦИЙ (80 УРОВНЕЙ) ---
# Структура: Массовые -> Психологические -> Технические -> Специфические (в конце)
SCENARIOS = [
    # --- БЛОК 1: ФИШИНГ (5 уровней) ---
    {
        "text": "Входящее от 'Support_TG': 'Ваш аккаунт будет удален. Подтвердите номер на сайте telegram-безопасность.рф'",
        "threat": "Фишинг", "correct": "ban",
        "feedback": "Ошибка! Официальный Telegram не использует домен .рф и не требует подтверждения через сторонние сайты.",
        "hint": "Присмотрись к домену. Официальный — telegram.org."
    },
    # ... тут еще 4 уровня фишинга (по возрастанию сложности) ...

    # --- БЛОК 2: ОВЕРШЕРИНГ (5 уровней) ---
    {
        "text": "Ты выложил фото своего нового паспорта, прикрыв пальцем только серию и номер, чтобы похвастаться.",
        "threat": "Овершеринг", "correct": "check",
        "feedback": "Ошибка! Внизу паспорта есть машиночитаемый код, в котором зашифрованы все твои данные. Серию и номер легко вычислить.",
        "hint": "Даже частичные данные документов в сети — это огромный риск."
    },

    # --- БЛОК: БЕЗОПАСНО (Разбавляем) ---
    {
        "text": "Мама прислала в Telegram ссылку на рецепт блинов с сайта povar.ru. Ты точно знаешь, что она сейчас готовит.",
        "threat": "Безопасно", "correct": "trust",
        "feedback": "Верно. Это обычное бытовое сообщение от близкого человека без признаков взлома.",
        "hint": "Контекст (мама готовит) и знакомый сайт подтверждают безопасность."
    },

    # --- БЛОК 3: КИБЕРБУЛЛИНГ (5 уровней) ---
    {
        "text": "В игровом чате тебя начали оскорблять и угрожать 'найти по IP' за то, что ты плохо сыграл раунд.",
        "threat": "Кибербуллинг", "correct": "ban",
        "feedback": "Правильно! Бан и игнор — единственное оружие против троллей. Найти по IP через чат игры почти невозможно.",
        "hint": "Не корми троллей своими эмоциями."
    },

    # --- БЛОК 8: ВИШИНГ (5 уровней) ---
    {
        "text": "Звонок: 'Я из техподдержки твоего провайдера. У нас сбой, назови код из SMS, чтобы мы восстановили тебе интернет'.",
        "threat": "Вишинг", "correct": "ban",
        "feedback": "Верно! Техподдержка никогда не просит коды из SMS. Это попытка получить доступ к твоему личному кабинету.",
        "hint": "Код из SMS — это твой цифровой ключ."
    },

    # --- БЛОК 9: AI-ИМПЕРСОНАЦИЯ (5 уровней) ---
    {
        "text": "Кружочек от друга: 'Бро, я в отделении, телефон садится, скинь 2к на этот номер, потом все объясню!'. Голос его, но движения губ чуть-чуть запаздывают.",
        "threat": "AI-имперсонация", "correct": "check",
        "feedback": "Правильно! Это дипфейк. Нужно перезвонить другу по обычной связи или задать личный вопрос.",
        "hint": "Нейросети уже умеют имитировать видео и голос."
    },

    # --- БЛОК 12: СЕКСТОРШЕН (5 уровней) ---
    {
        "text": "Новая знакомая из сети, с которой ты переписывался неделю, угрожает разослать твои интимные фото друзьям, если ты не заплатишь.",
        "threat": "Сексторшен", "correct": "check",
        "feedback": "Не плати! Шантажисты не остановятся. Заблокируй, сделай скрины и расскажи родителям. Это преступление.",
        "hint": "Шантаж — это ловушка, деньги её не закроют."
    },

    # --- БЛОК 15: ДЕАНОН (5 уровней - В КОНЦЕ) ---
    {
        "text": "Ты используешь ник 'Gamer1337' в Steam, Discord и старом профиле на форуме, где 3 года назад ты выкладывал свое фото.",
        "threat": "Деанон", "correct": "check",
        "feedback": "Через один никнейм можно связать твои игровые аккаунты с реальным лицом. Используй разные ники.",
        "hint": "Цифровой след — это цепочка из твоих старых действий."
    },

    # --- БЛОК 16: СВАТТИНГ (5 уровней - САМЫЕ ПОСЛЕДНИЕ) ---
    {
        "text": "На стриме ты случайно показал в окно редкое здание. В чате написали: 'Я знаю твой адрес. Вызываю к тебе ОМОН. Прощайся с компом'.",
        "threat": "Сваттинг", "correct": "check",
        "feedback": "Это риск сваттинга. Нужно немедленно выключить стрим и подготовиться к визиту полиции (не паниковать, иметь документы).",
        "hint": "Геолокация по виду из окна — реальный инструмент хейтеров."
    }
]

# --- ДВИЖОК ИГРЫ ---

def get_p(chat_id):
    if chat_id not in players:
        players[chat_id] = {'hp': 100, 'xp': 0, 'idx': 0, 'history': []}
    return players[chat_id]

@bot.message_handler(commands=['start'])
def start(message):
    p = get_p(message.chat.id)
    p.update({'hp': 100, 'xp': 0, 'idx': 0})
    
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Начать смену 🛡", callback_data="play"))
    
    bot.send_message(message.chat.id, 
        f"<b>Привет, {message.from_user.first_name}!</b>\n\n"
        "Ты — модератор собственной безопасности. Тебе предстоит разобрать 80 ситуаций.\n"
        "У тебя есть 100 ❤️ HP. Ошибки отнимают здоровье.\n"
        "Набери максимум ⭐ XP, чтобы стать 'Кибер-Легендой'.\n\n"
        "<b>Твои инструменты:</b>\n"
        "✅ Доверять — если все чисто.\n"
        "🔍 Проверить — если нужно уточнить или сменить пароль.\n"
        "🚫 В бан! — если это явная атака.", 
        parse_mode='HTML', reply_markup=markup)

def show_level(chat_id):
    p = get_p(chat_id)
    if p['idx'] >= len(SCENARIOS):
        return finish(chat_id)
    
    task = SCENARIOS[p['idx']]
    markup = types.InlineKeyboardMarkup(row_width=3)
    markup.add(
        types.InlineKeyboardButton("Доверять ✅", callback_data="ans_trust"),
        types.InlineKeyboardButton("Проверить 🔍", callback_data="ans_check"),
        types.InlineKeyboardButton("В бан! 🚫", callback_data="ans_ban")
    )
    markup.add(types.InlineKeyboardButton("Взять подсказку 💡", callback_data="hint"))
    
    msg = f"<b>Ситуация №{p['idx'] + 1} / {len(SCENARIOS)}</b>\n\n{task['text']}"
    bot.send_message(chat_id, msg, parse_mode='HTML', reply_markup=markup)

@bot.callback_query_handler(func=lambda call: True)
def callback_handler(call):
    p = get_p(call.message.chat.id)
    
    if call.data == "play":
        show_level(call.message.chat.id)
    
    elif call.data == "hint":
        bot.answer_callback_query(call.id, SCENARIOS[p['idx']]['hint'], show_alert=True)

    elif call.data.startswith("ans_"):
        user_choice = call.data.split("_")[1]
        task = SCENARIOS[p['idx']]
        
        if user_choice == task['correct']:
            p['xp'] += 25
            res_icon = "✨ <b>ВЕРНО!</b>"
        else:
            p['hp'] -= 20
            res_icon = "⚠️ <b>ОШИБКА!</b>"
        
        reveal_msg = (
            f"{res_icon}\n\n"
            f"<b>Угроза:</b> {task['threat']}\n"
            f"<b>Разбор:</b> {task['feedback']}\n\n"
            f"❤️ HP: {p['hp']} | ⭐ XP: {p['xp']}"
        )
        
        p['idx'] += 1
        
        if p['hp'] <= 0:
            markup = types.InlineKeyboardMarkup().add(types.InlineKeyboardButton("Попробовать снова 🔄", callback_data="play"))
            bot.send_message(call.message.chat.id, "💀 <b>Твой цифровой профиль уничтожен.</b>\nТы совершил критическую ошибку и потерял доступ ко всем данным.", parse_mode='HTML', reply_markup=markup)
            p.update({'hp': 100, 'xp': 0, 'idx': 0})
            return

        markup = types.InlineKeyboardMarkup().add(types.InlineKeyboardButton("Далее ➡️", callback_data="play"))
        bot.send_message(call.message.chat.id, reveal_msg, parse_mode='HTML', reply_markup=markup)

def finish(chat_id):
    p = get_p(chat_id)
    if p['xp'] >= 1500: rank = "КИБЕР-ЛЕГЕНДА 🏆"
    elif p['xp'] >= 800: rank = "СЕТЕВОЙ СТРАЖ 🛡"
    else: rank = "ЦИФРОВОЙ ВЫЖИВШИЙ 💀"
    
    bot.send_message(chat_id, f"🏆 <b>ИГРА ПРОЙДЕНА!</b>\n\nТвой ранг: {rank}\nИтоговый опыт: {p['xp']}\n\nТеперь ты готов к реальным угрозам интернета!", parse_mode='HTML')

bot.polling(none_stop=True)
