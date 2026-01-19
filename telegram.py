
import telebot
from telebot import types
import time # Для имитации набора текста

# 1. Вставь сюда свой токен от @BotFather
TOKEN = '8529654935:AAH-2XvgJAabbzXOx5J0dGrFNASYue7breg'
bot = telebot.TeleBot(TOKEN)

# База данных игроков в памяти
players = {}

# --- СТРУКТУРА УГРОЗ ---
# Каждая угроза - это список заданий.
# Каждое задание - это словарь с:
#   - text: текст сообщения
#   - markup: клавиатура с кнопками
#   - correct_callback: что делать при правильном ответе (func, xp_gain)
#   - fail_callback: что делать при неправильном ответе (func, hp_loss)
#   - hint_callback: что делать при нажатии подсказки (func)

threats_data = {
    'phishing': [
        { # Уровень 1
            'text': "Уровень 1: Фишинг 🎣\n\nТебе пришло сообщение: 'Ваш аккаунт будет удален! Срочно подтвердите данные на сайте: `https://steam-comunitty.com/login`'. Твои действия?",
            'markup': types.InlineKeyboardMarkup(row_width=1).add(
                types.InlineKeyboardButton("Ввести логин и пароль 🔑", callback_data='phishing_1_fail'),
                types.InlineKeyboardButton("Проверить адрес ссылки 🔍", callback_data='phishing_1_hint'),
                types.InlineKeyboardButton("Удалить письмо 🗑️", callback_data='phishing_1_win')
            ),
            'correct_callback': ('lvl2', 25), # Переход на следующий уровень, +25 XP
            'fail_callback': ('lvl2', -30),  # Переход на следующий уровень, -30 HP
            'hint_callback': ('phishing_1_hint', 0) # Подсказка, 0 XP (не тратим)
        },
        { # Уровень 2
            'text': "Уровень 2: Фишинг (Смишинг) SMS 📱\n\nПришло SMS: 'Ваша посылка задержана. Оплатите пошлину 50 руб. по ссылке: `bit.ly/customs-pay-99`'. Твои действия?",
            'markup': types.InlineKeyboardMarkup(row_width=1).add(
                types.InlineKeyboardButton("Оплатить пошлину 💳", callback_data='phishing_2_fail'),
                types.InlineKeyboardButton("Проверить ссылку и отправителя 🔍", callback_data='phishing_2_hint'),
                types.InlineKeyboardButton("Игнорировать 🙅‍♂️", callback_data='phishing_2_win')
            ),
            'correct_callback': ('lvl3', 25),
            'fail_callback': ('lvl3', -30),
            'hint_callback': ('phishing_2_hint', 0)
        },
        # Добавь еще 3 задания для фишинга...
        # Пример:
        # { # Уровень 3
        #    'text': "...",
        #    'markup': ...,
        #    'correct_callback': ('lvl4_grooming', 25), # Переход на другой тип угрозы
        #    'fail_callback': ('lvl4_grooming', -30),
        #    'hint_callback': ('phishing_3_hint', 0)
        # },
    ],
    'grooming': [
        { # Уровень 1
            'text': "Уровень 1: Груминг 👤\n\n'Привет! Я продюсер, помогу тебе стать звездой. Скинь фото в полный рост, это наш секрет. Родителям не говори'. Твои действия?",
            'markup': types.InlineKeyboardMarkup(row_width=1).add(
                types.InlineKeyboardButton("Скину фото 📸", callback_data='grooming_1_fail'),
                types.InlineKeyboardButton("Спрошу, почему секрет 🤔", callback_data='grooming_1_hint'),
                types.InlineKeyboardButton("Заблокировать и пожаловаться 🚫", callback_data='grooming_1_win')
            ),
            'correct_callback': ('lvl2_grooming', 30), # +30 XP
            'fail_callback': ('lvl2_grooming', -50),  # -50 HP
            'hint_callback': ('grooming_1_hint', 0)
        },
        { # Уровень 2
            'text': "Уровень 2: Груминг (Встреча) 🤝\n\n'Знакомство в парке завтра в 12:00. Возьми друга, если боишься. Адрес: Парк Горького, главная аллея'. Твои действия?",
            'markup': types.InlineKeyboardMarkup(row_width=1).add(
                types.InlineKeyboardButton("Согласиться на встречу 😬", callback_data='grooming_2_fail'),
                types.InlineKeyboardButton("Сказать, что пойду с родителями 👨‍👩‍👧‍👦", callback_data='grooming_2_hint'),
                types.InlineKeyboardButton("Отказаться и заблокировать 🚫", callback_data='grooming_2_win')
            ),
            'correct_callback': ('lvl3_grooming', 30),
            'fail_callback': ('lvl3_grooming', -50),
            'hint_callback': ('grooming_2_hint', 0)
        },
        # Добавь еще 3 задания для груминга...
    ],
    # Добавь сюда 'cyberbullying' и 'crime' с 5 заданиями для каждого
    'cyberbullying': [],
    'crime': []
}

# --- ФУНКЦИИ ДЛЯ ОБРАБОТКИ ---

def get_player(chat_id):
    if chat_id not in players:
        players[chat_id] = {'hp': 100, 'xp': 0, 'current_threat': 'phishing', 'level_index': 0, 'name': ''}
    return players[chat_id]

def send_message_with_typing(chat_id, text, reply_markup=None, delay=1.5):
    bot.send_chat_action(chat_id, 'typing')
    time.sleep(delay)
    bot.send_message(chat_id, text, reply_markup=reply_markup, parse_mode='HTML')

def generate_threat_text(p, threat_key, level_index):
    if threat_key not in threats_data or level_index >= len(threats_data[threat_key]):
        return None # Угрозы закончились
    
    data = threats_data[threat_key][level_index]
    
    # Форматирование текста с учетом HTML для bold/italics
    formatted_text = f"<b>Уровень {level_index + 1}: {threat_key.replace('_', ' ').title()}</b>\n\n{data['text']}"
    
    return formatted_text, data['markup']

def send_feedback(chat_id, feedback_text, next_step_data, is_win):
    p = get_player(chat_id)
    xp_gain = next_step_data[1] if next_step_data else 0
    hp_loss = next_step_data[1] if next_step_data and not is_win else 0 # HP теряется только при проигрыше
    
    if not is_win:
        p['hp'] += hp_loss # hp_loss будет отрицательным
    else:
        p['xp'] += xp_gain
    
    if p['hp'] < 0: p['hp'] = 0 # HP не может быть меньше 0

    final_feedback = f"{feedback_text}\n\n"
    if is_win:
        final_feedback += f"<b>✅ УСПЕХ!</b> (+{xp_gain} XP)"
    else:
        final_feedback += f"<b>❌ ОШИБКА!</b> ({hp_loss} HP)"
        
    final_feedback += f"\n\n<b>❤️ HP: {p['hp']} | ⭐ XP: {p['xp']}</b>"
    
    next_lvl_key = next_step_data[0] if next_step_data else 'menu' # Переход к следующему этапу
    
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Продолжить ➡️", callback_data=next_lvl_key))
    
    send_message_with_typing(chat_id, final_feedback, markup)

    # Обработка конца игры
    if p['hp'] <= 0:
        bot.send_message(chat_id, "💀 ТВОЕ HP ЗАКОНЧИЛОСЬ. ИГРА ОКОНЧЕНА.")
        show_result(chat_id)
        return True # Игра окончена
    
    return False # Игра продолжается

def show_result(chat_id):
    p = get_player(chat_id)
    
    if p['hp'] <= 0:
        rank = "НУБ В КИБЕРБЕЗЕ 🤡"
    elif p['xp'] >= 150: # Примерные пороги для рангов
        rank = "КИБЕР-ЛЕГЕНДА 🏆"
    elif p['xp'] >= 75:
        rank = "ОСТОРОЖНЫЙ ПОЛЬЗОВАТЕЛЬ 🛡️"
    else:
        rank = "ЦИФРОВОЙ ВЫЖИВШИЙ 💀"
        
    res_text = (
        f"🏆 ИГРА ЗАВЕРШЕНА!\n\n"
        f"Твой результат:\n"
        f"❤️ Здоровье: {p['hp']}\n"
        f"⭐ Опыт: {p['xp']}\n\n"
        f"Твой ранг: {rank}\n\n"
        "Помни: в интернете ты сам отвечаешь за свою безопасность! Нажми /start, чтобы переиграть."
    )
    bot.send_message(chat_id, res_text)

# --- ОБРАБОТЧИК КОМАНДЫ START ---
@bot.message_handler(commands=['start'])
def start_game(message):
    chat_id = message.chat.id
    players[chat_id] = {'hp': 100, 'xp': 0, 'current_threat': 'phishing', 'level_index': 0, 'name': message.from_user.first_name}
    
    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("Начать Игру 🚀", callback_data='start_game_btn'))
    
    welcome_text = (
        f"Привет, {players[chat_id]['name']}! 👋\n\n"
        "Добро пожаловать в игру 'Кибер-Щит'.\n"
        "Твоя задача — пройти 25 ситуаций и не дать мошенникам себя обмануть.\n\n"
        "<b>❤️ Твоё здоровье (HP): 100</b>\n"
        "<b>⭐ Твой опыт (XP): 0</b>\n\n"
        "Готов проверить свои навыки?"
    )
    bot.send_message(chat_id, welcome_text, reply_markup=markup, parse_mode='HTML')

# --- ОБРАБОТЧИК НАЖАТИЙ КНОПОК ---
# --- ОБРАБОТЧИК НАЖАТИЙ КНОПОК ---
@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    chat_id = call.message.chat.id
    p = get_player(chat_id)
    
    # Если игрок начал игру
    if call.data == 'start_game_btn':
        send_next_threat(chat_id)
        return
    
    # Обработка завершения игры
    if call.data == 'finish':
        show_result(chat_id)
        return

    # !!! ВАЖНО: Обработка перехода между уровнями (кнопка "Продолжить")
    # Если пришло 'lvl2', 'lvl3' и т.д. или переход к новой угрозе
    if '_' not in call.data and not call.data.endswith(('win', 'fail', 'hint')):
        # Здесь логика, если callback_data - это просто название следующего уровня (например 'lvl2')
        # В текущей версии кода это может вызвать ошибку split ниже, поэтому добавим проверку
        # Но для исправления твоей ошибки TypeError это не критично, идем дальше
        pass 

    # Парсим callback_data
    try:
        threat_key, level_index_str, action = call.data.split('_')
        level_index = int(level_index_str) - 1 
    except ValueError:
        # Это ловит нажатие кнопки "Продолжить" (например 'lvl2'), если оно не обработано выше
        # Для простоты, если нажали "Продолжить", просто шлем следующую угрозу
        send_next_threat(chat_id) 
        return
    
    if threat_key not in threats_data or level_index >= len(threats_data[threat_key]):
        bot.send_message(chat_id, "Ошибка: данные уровня не найдены. Попробуйте /start.")
        return
        
    threat_level_data = threats_data[threat_key][level_index]
    
    # --- ИСПРАВЛЕНИЕ НИЖЕ ---
    
    if action == 'fail':
        # БЫЛО: feedback, next_data = threat_level_data['fail_callback']
        # СТАЛО: Берем весь кортеж целиком
        next_step_data = threat_level_data['fail_callback'] 
        
        fail_text_map = {
            'phishing_1_fail': "❌ ОШИБКА! Ты перешел на сайт-двойник. Пароль украден! (-30 HP)",
            'phishing_2_fail': "❌ ОШИБКА! Данные карты украдены. (-30 HP)",
            'grooming_1_fail': "❌ ОПАСНО! Тебя могут шантажировать. (-50 HP)",
            'grooming_2_fail': "❌ ОПАСНО! Ты подверг себя риску. (-50 HP)",
        }
        feedback_text = fail_text_map.get(call.data, "❌ Ошибка. (-30 HP)")
        
        # Передаем весь кортеж next_step_data
        game_over = send_feedback(chat_id, feedback_text, next_step_data, is_win=False)
        
        if not game_over:
            # Логика обновления уровня (упрощенная)
            p['level_index'] += 1

    elif action == 'win':
        # БЫЛО: feedback, next_data = threat_level_data['correct_callback']
        # СТАЛО: Берем весь кортеж целиком
        next_step_data = threat_level_data['correct_callback']
        
        win_text_map = {
            'phishing_1_win': "✅ КРАСАВА! Аккаунт в безопасности! (+25 XP)",
            'phishing_2_win': "✅ УМНИЦА! Игнорируй мошенников! (+25 XP)",
            'grooming_1_win': "✅ ВЕРНО! Не шли фото незнакомцам. (+30 XP)",
            'grooming_2_win': "✅ ПРАВИЛЬНО! Лучше сказать родителям. (+30 XP)",
        }
        feedback_text = win_text_map.get(call.data, "✅ Отлично! (+25 XP)")

        # Передаем весь кортеж next_step_data
        send_feedback(chat_id, feedback_text, next_step_data, is_win=True)
        
        # Логика обновления уровня
        p['level_index'] += 1

    elif action == 'hint':
        # Логика подсказки остается прежней, так как она не использует send_feedback с кортежем
        hint_text_map = {
            'phishing_1_hint': "🔍 ПОДСКАЗКА: Смотри на адрес ссылки (comunitty).",
            'phishing_2_hint': "🔍 ПОДСКАЗКА: SMS с просьбой оплаты — ловушка.",
            'grooming_1_hint': "🤔 ПОДСКАЗКА: Почему это секрет от родителей?",
            'grooming_2_hint': "🤔 ПОДСКАЗКА: Настаивает на встрече? Это опасно.",
        }
        hint_text = hint_text_map.get(call.data, "🔍 Подсказка...")
        
        markup = types.InlineKeyboardMarkup()
        original_data = threat_level_data['markup'].to_dict()['inline_keyboard']
        for row in original_data:
            for btn_data in row:
                 if btn_data['callback_data'].endswith('_win') or btn_data['callback_data'].endswith('_fail'):
                      markup.add(types.InlineKeyboardButton(btn_data['text'], callback_data=btn_data['callback_data']))
        
        # Исправляем callback для продолжения после подсказки, чтобы он не вызывал ошибку парсинга
        # Просто возвращаем пользователя к выбору
        bot.edit_message_text(f"{hint_text}\n\n👇 <b>Выберите действие:</b>", chat_id, call.message.message_id, reply_markup=markup, parse_mode='HTML')

# --- Вспомогательные функции для обработки callback_data ---
@bot.callback_query_handler(func=lambda call: '_continue' in call.data)
def continue_after_hint(call):
    chat_id = call.message.chat.id
    p = get_player(chat_id)
    
    threat_key, level_str = call.data.split('_continue')[0].rsplit('_', 1)
    level_index = int(level_str) - 1
    
    # Находим нужные данные
    if threat_key not in threats_data or level_index >= len(threats_data[threat_key]):
        bot.send_message(chat_id, "Ошибка. Попробуйте /start.")
        return
    
    data = threats_data[threat_key][level_index]
    
    # Возвращаем исходные кнопки выбора
    bot.edit_message_text(data['text'], chat_id, call.message.message_id, reply_markup=data['markup'], parse_mode='HTML')


def send_next_threat(chat_id):
    p = get_player(chat_id)
    
    # Если игрок прошел все уровни угрозы, переходим к следующему типу угрозы
    if p['current_threat'] not in threats_data or p['level_index'] >= len(threats_data[p['current_threat']]):
        threat_keys = list(threats_data.keys())
        current_threat_index = threat_keys.index(p['current_threat'])
        
        if current_threat_index + 1 < len(threat_keys):
            p['current_threat'] = threat_keys[current_threat_index + 1]
            p['level_index'] = 0
        else:
            # Все угрозы пройдены, показываем результат
            p['xp'] += 50 # Бонус за полное прохождение
            p['hp'] = max(0, p['hp']) # HP не может быть ниже 0
            show_result(chat_id)
            return

    threat_key = p['current_threat']
    level_index = p['level_index']
    
    if threat_key not in threats_data or level_index >= len(threats_data[threat_key]):
        bot.send_message(chat_id, "Ошибка: данные уровня не найдены. Попробуйте /start.")
        return

    data = threats_data[threat_key][level_index]
    
    # Форматируем текст с учетом HTML
    text_to_send = f"<b>Уровень {level_index + 1}: {threat_key.replace('_', ' ').title()}</b>\n\n{data['text']}"
    
    send_message_with_typing(chat_id, text_to_send, data['markup'], delay=1) # Уменьшим задержку для ботов

# --- ФУНКЦИЯ ФИНАЛА ---
def show_result(chat_id):
    p = get_player(chat_id)
    
    # Расчет ранга
    if p['hp'] <= 0:
        rank = "НУБ В КИБЕРБЕЗЕ 🤡"
        xp_bonus_text = ""
    elif p['xp'] >= 150:
        rank = "КИБЕР-ЛЕГЕНДА 🏆"
        xp_bonus_text = "\n🔥 Дополнительно +50 XP за полное прохождение!"
    elif p['xp'] >= 75:
        rank = "ОСТОРОЖНЫЙ ПОЛЬЗОВАТЕЛЬ 🛡️"
        xp_bonus_text = ""
    else:
        rank = "ЦИФРОВОЙ ВЫЖИВШИЙ 💀"
        xp_bonus_text = ""
        
    res_text = (
        f"🏆 ИГРА ЗАВЕРШЕНА!\n\n"
        f"Твой результат:\n"
        f"❤️ Здоровье: {p['hp']}\n"
        f"⭐ Опыт: {p['xp']}{xp_bonus_text}\n\n"
        f"Твой ранг: {rank}\n\n"
        "<b>Помни: в интернете ты сам отвечаешь за свою безопасность!</b>\n"
        "Нажми /start, чтобы переиграть."
    )
    bot.send_message(chat_id, res_text, parse_mode='HTML')
    # Удаляем игрока из памяти после финала (или можно оставить для статистики)
    # del players[chat_id]

# --- ЗАПУСК БОТА ---
if __name__ == '__main__':
    print("Бот запущен...")
    bot.polling(none_stop=True)

