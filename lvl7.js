document.addEventListener('DOMContentLoaded', () => {
    const curtain = document.getElementById('curtain');
    
    // Плавное появление экрана
    if (curtain) {
        // Убеждаемся, что шторка закроет всё сразу, а потом начнет исчезать
        setTimeout(() => {
            curtain.classList.add('fade-out');
        }, 300); // Пауза перед началом исчезновения (чтобы игрок успел моргнуть)
    }

    // Запуск текста чуть позже, чтобы он не печатался в темноте
    setTimeout(() => {
        if (typeof startTyping === 'function') {
            startTyping("Ты в прямом эфире! Зрители собираются. Будь внимателен к чату и донатам.");
        }
    }, 1000); 


    // ГЕНЕРАЦИЯ ЧАТА 
    const chatArea = document.getElementById('streamChat');
    const nicknames = ["nagibator2000", "Kate_Smile", "ProGamer", "Alex", "Masha", "Ivan_Ivanov", "CyberNinja", "CatLover", "sashapro", "fdkfdfkdfjdk", "dream", "mineproplayer", "super666", "shadow303", "steve233", "alex399", "herobrine"];
    const colors = ["u-red", "u-blue", "u-green", "u-yellow", "u-purple"];
    const phrases = ["привет!", "привееет", "КУ", "ку", "как дела", "го в пати", "xd", "gggggggg", "скилл", "где актив?", "модеры тут?", "подпишись пж", "красава", "+rep", "топ", "имба"];

    function addChatMessage() {
        if (!chatArea) return;
        const div = document.createElement('div');
        div.className = "chat-msg";
        const randomNick = nicknames[Math.floor(Math.random() * nicknames.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomText = phrases[Math.floor(Math.random() * phrases.length)];
        div.innerHTML = `<span class="chat-user ${randomColor}">${randomNick}:</span> <span class="chat-text">${randomText}</span>`;
        chatArea.appendChild(div);
        if (chatArea.children.length > 50) chatArea.removeChild(chatArea.children[0]);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Регулировка скорости чата (сделал чуть медленнее, как ты просил)
    let chatSpeed = 2000; 
    function chatLoop() {
        addChatMessage();
        setTimeout(chatLoop, chatSpeed);
    }
    chatLoop();

    setTimeout(() => { chatSpeed = 800; }, 3000); // Было 600
    setTimeout(() => { chatSpeed = 350; }, 6000); // Было 150 (теперь быстрее, но читаемо)

    // --- 3. СЦЕНАРИЙ УРОВНЯ ---
    setTimeout(() => {
        startTyping("Ты в прямом эфире! Зрители собираются. Будь внимателен к чату и донатам.");
    }, 800);

    setTimeout(stage1_Warmup, 7000);
});

// --- ИСПРАВЛЕННАЯ ФУНКЦИЯ ПЕЧАТИ (БЕЗ ДУБЛИРОВАНИЯ) ---
function startTyping(text, onComplete = null) {
    const textElement = document.getElementById('typewriter');
    if (!textElement) return;

    // Останавливаем все запущенные таймеры, если они есть
    if (window.typingTimer) {
        clearTimeout(window.typingTimer);
    }
    
    textElement.innerHTML = ""; // Очищаем поле полностью
    let charIndex = 0;
    const typingSpeed = 30;

    function typeLoop() {
        if (charIndex < text.length) {
            textElement.append(text.charAt(charIndex)); // Используем append для безопасности
            charIndex++;
            window.typingTimer = setTimeout(typeLoop, typingSpeed);
        } else {
            if (onComplete) onComplete();
        }
    }
    typeLoop();
}

// --- ЭТАПЫ ИГРЫ (Логика остается прежней) ---

function stage1_Warmup() {
    showDonation("CatLover", 300, "Обожаю твои стримы! Купи себе пиццу 🍕", "normal");
    startTyping("О, первый донат! Отличное начало стрима. Читаем чат дальше...");
    setTimeout(stage2_PrivacyThreat, 8000);
}

function stage2_PrivacyThreat() {
    addSpecificChatMessage("Stalker_007", "Привет! Крутой стрим. А ты в какой школе учишься? Кажется, я тебя видел на улице Мира.", "u-blue");
    startTyping("Один из зрителей задает личный вопрос про твое место учебы. Как ответишь?");
    showChoices([
        { text: "Назвать номер школы (вдруг это реально знакомый)", action: () => handleStage2(false) },
        { text: "Отшутиться и не называть реальных адресов", action: () => handleStage2(true) }
    ]);
}

function handleStage2(isCorrect) {
    clearChoices();
    if (isCorrect) {
        startTyping("Правильно. Никогда не раскрывай точное место учебы или адрес на стриме.", () => {
            setTimeout(stage3_ToxicThreat, 5000);
        });
    } else {
        startTyping("ОШИБКА. Сталкер узнал твой адрес. Личная безопасность под угрозой!", () => {
            setTimeout(() => location.reload(), 4000);
        });
    }
}

function stage3_ToxicThreat() {
    addSpecificChatMessage("Hater99", "Стрим скучный, ты играть вообще не умеешь. Давай модерку или забаню канал.", "u-red");
    startTyping("В чате появился тролль. Он провоцирует тебя. Твои действия?");
    showChoices([
        { text: "Начать ругаться с ним в прямом эфире", action: () => handleStage3(false) },
        { text: "Молча выдать бан и удалить сообщения", action: () => handleStage3(true) }
    ]);
}

function handleStage3(isCorrect) {
    clearChoices();
    if (isCorrect) {
        startTyping("Отлично! Бан — лучшее оружие против троллей.", () => {
            setTimeout(stage4_PhishingDonat, 5000);
        });
    } else {
        startTyping("ОШИБКА. Ты сорвался, и чат превратился в хаос. Не корми троллей!", () => {
            setTimeout(() => location.reload(), 4000);
        });
    }
}

function stage4_PhishingDonat() {
    startTyping("Стрим продолжается... Ого! Кажется, прилетел просто огромный донат!");
    setTimeout(() => {
        showDonation("CryptoKing", 50000, "Бро, лови на развитие! Чтобы деньги зачислились, подтверди тут: stream-payouts.xyz/verify", "scam");
        setTimeout(() => {
            startTyping("Сумма огромная, но ссылка в донате выглядит странно. Что сделаешь?");
            showChoices([
                { text: "Перейти по ссылке и забрать 50 000 руб.", action: () => handleStage4(false) },
                { text: "Проигнорировать ссылку. Это попытка взлома.", action: () => handleStage4(true) }
            ]);
        }, 4000);
    }, 2000);
}

function handleStage4(isCorrect) {
    clearChoices();
    if (isCorrect) {
        startTyping("ВЕРНО! Это фишинг. Настоящие донаты приходят сразу. Уровень пройден!", () => {
            setTimeout(finishLevel, 4000);
        });
    } else {
        startTyping("ОШИБКА! Ты перешел по ссылке и потерял доступ к каналу.", () => {
            setTimeout(() => location.reload(), 4000);
        });
    }
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function showDonation(user, amount, text, type) {
    const chatArea = document.getElementById('streamChat');
    const donatMsg = document.createElement('div');
    const cardClass = type === 'scam' ? 'donat-card donat-scam' : 'donat-card donat-normal';
    donatMsg.className = `chat-msg ${cardClass}`;
    donatMsg.innerHTML = `<div class="donat-header">💎 ДОНАТ: ${amount} РУБ.</div><div class="donat-body"><strong>${user}:</strong> ${text}</div>`;
    chatArea.appendChild(donatMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function addSpecificChatMessage(user, text, colorClass) {
    const chatArea = document.getElementById('streamChat');
    const div = document.createElement('div');
    div.className = "chat-msg toxic-highlight";
    div.innerHTML = `<span class="chat-user ${colorClass}">${user}:</span> <span class="chat-text">${text}</span>`;
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function showChoices(options) {
    const dialogueBox = document.querySelector('.dialogue-box');
    const container = document.createElement('div');
    container.id = 'modern-choices';
    container.className = 'modern-choices-container';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'modern-btn neutral-btn';
        btn.innerText = opt.text;
        btn.onclick = opt.action;
        container.appendChild(btn);
    });
    dialogueBox.appendChild(container);
}

function clearChoices() {
    const container = document.getElementById('modern-choices');
    if (container) container.remove();
}

function finishLevel() {
    if (typeof completeLevel === 'function') completeLevel(7);
    const curtain = document.getElementById('curtain');
    if (curtain) curtain.classList.remove('fade-out');
    setTimeout(() => { window.location.href = 'lvl8.html'; }, 1000);
}