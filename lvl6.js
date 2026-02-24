const chatArea = document.getElementById('chatArea');
const actionTray = document.getElementById('actionTray');
const logText = document.getElementById('logText');
const diagTitle = document.getElementById('diagTitle');
const dialogueBox = document.getElementById('dialogueBox');
const securityBar = document.getElementById('securityBar');
const reputationBar = document.getElementById('reputationBar');
const videoFeed = document.getElementById('videoFeed');
const videoStatus = document.getElementById('videoStatus');
const typingIndicator = document.getElementById('chatTypingIndicator');
const startOverlay = document.getElementById('startOverlay');

let stats = { security: 100, reputation: 100, step: 0, isGameOver: false };
let diagTimeout;

const scenarios = [
    {
        id: 'phishing',
        sender: 'Security_Center_Bot',
        text: '⚠️ Обнаружен вход из г. Шанхай. Если это не вы, срочно смените пароль для @vasya_player_the_best по защищенному каналу: <br><a href="#" style="color:var(--accent)">instapic-account-verify.net/security</a>',
        recommendation: 'Внимательно проверяй домены ссылок. Официальные уведомления никогда не ведут на сторонние сайты для ввода пароля.',
        choices: [
            { t: 'Срочно перейти и сменить пароль', correct: false, log: 'ОШИБКА: Это был фишинг. Ты отдал пароль хакерам.', secChange: -60, repChange: -10 },
            { t: 'Игнорировать и проверить безопасность в приложении', correct: true, log: 'ВЕРНО: Ты проверил настройки изнутри. Ссылку в Директе прислали мошенники.', secChange: +10, repChange: 0 }
        ]
    },
    {
        id: 'blackmail',
        sender: 'Ghost_Admin',
        text: 'Вася, у меня есть все твои старые фото и черновеки видео. Либо ты рекламируешь мой курс "Скам-Мастер" прямо сейчас, либо всё будет в сети.',
        recommendation: 'Шантаж - это уголовное преступление. Уступка шантажисту только увеличивает его аппетиты.',
        choices: [
            { t: 'Прорекламировать курс, чтобы спасти данные', correct: false, log: 'ПРОВАЛ: Аудитория поняла, что ты рекламируешь скам. Ты потерял доверие.', secChange: 0, repChange: -80 },
            { t: 'Заявить о шантаже в эфире и обратиться в поддержку', correct: true, log: 'Отлично! Твоя честность укрепила связь с фанатами. Хакер бессилен.', secChange: +10, repChange: +20 }
        ]
    },
    {
        id: 'deepfake',
        sender: 'Модератор_Чата',
        text: 'Вася, внимание! Кто-то запустил стрим-клон с твоим лицом с помощью нейросети и собирает донаты на фальшивый благотворительный фонд!',
        recommendation: 'Дипфейки можно узнать по странному морганию, размытости вокруг рта или неестественному голосу.',
        isDeepfake: true,
        choices: [
            { t: 'Проигнорировать, фанаты сами разберутся', correct: false, log: 'О НЕТ! Мошенники успели обмануть часть твоих подписчиков.', secChange: -20, repChange: -40 },
            { t: 'Разоблачить фейк в своем эфире, показав его ошибки', correct: true, log: 'Отлично! Ты наглядно показал, как работают дипфейки. Твой авторитет вырос.', secChange: +5, repChange: +30 }
        ]
    }
];


function startGame() {
    startOverlay.style.display = 'none';
    updateBars();
    setTimeout(() => {
        showDialogue("СТАРТ ЭФИРА", "Следи за сообщениями в Директе и не дай хакерам обмануть тебя или твоих фанатов!", "var(--accent)", 5000);
        startScenario();
    }, 500);
}

function showDialogue(title, text, color = "#8b949e", duration = 5000) {
    clearTimeout(diagTimeout);
    diagTitle.innerText = title;
    diagTitle.style.color = color;
    logText.innerText = text;
    dialogueBox.classList.add('visible');
    if (duration > 0) diagTimeout = setTimeout(() => dialogueBox.classList.remove('visible'), duration);
}

function updateBars() {
    stats.security = Math.max(0, Math.min(100, stats.security));
    stats.reputation = Math.max(0, Math.min(100, stats.reputation));

    securityBar.style.width = stats.security + '%';
    reputationBar.style.width = stats.reputation + '%';
    
    securityBar.style.background = stats.security < 40 ? 'var(--danger)' : 'var(--success)';
    reputationBar.style.background = stats.reputation < 40 ? 'var(--danger)' : 'var(--accent)';

    if (!stats.isGameOver) {
        if (stats.security <= 0) endGame("Ваш аккаунт был взломан и полностью скомпрометирован.", false);
        else if (stats.reputation <= 0) endGame("Ваша репутация уничтожена. Карьера блогера закончена.", false);
    }
}

function addMessage(sender, text, isCritical = false) {
    const div = document.createElement('div');
    div.className = `bubble ${isCritical ? 'system-alert' : 'received'}`;
    div.innerHTML = `<strong>${sender}</strong><br>${text}`;
    // Always insert before the typing indicator
    chatArea.insertBefore(div, typingIndicator);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function startScenario() {
    if (stats.isGameOver) return;
    if (stats.step >= scenarios.length) {
        endGame("Вы успешно защитили свой аккаунт и доказали свою цифровую грамотность!", true);
        return;
    }

    const s = scenarios[stats.step];
    
    // Show typing indicator at the bottom of the chat
    typingIndicator.style.display = 'flex';
    chatArea.scrollTop = chatArea.scrollHeight;

    setTimeout(() => {
        typingIndicator.style.display = 'none';
        addMessage(s.sender, s.text, s.isDeepfake);
        showDialogue("РЕКОМЕНДАЦИЯ", s.recommendation, "#8b949e", 6000);

        if (s.isDeepfake) {
            videoFeed.classList.add('glitch-active');
            videoStatus.innerText = "⚠️ ВНИМАНИЕ: ЦИФРОВАЯ АТАКА";
            videoStatus.style.color = "var(--danger)";
        }

        actionTray.innerHTML = '';
        s.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerText = c.t;
            btn.onclick = () => makeChoice(c, s.isDeepfake);
            actionTray.appendChild(btn);
        });
    }, 2000);
}

function makeChoice(choice, wasDeepfake) {
    actionTray.innerHTML = '';
    
    // Add user message
    const div = document.createElement('div');
    div.className = 'bubble sent';
    div.innerHTML = choice.t;
    chatArea.insertBefore(div, typingIndicator);
    chatArea.scrollTop = chatArea.scrollHeight;

    if (wasDeepfake) {
        videoFeed.classList.remove('glitch-active');
        videoStatus.innerText = "Прямой эфир: Ответы на вопросы";
        videoStatus.style.color = "#ccc";
    }

    stats.security += choice.secChange;
    stats.reputation += choice.repChange;
    
    updateBars();

    if (choice.correct) {
        showDialogue("ХОРОШИЙ ВЫБОР", choice.log, "var(--success)", 4000);
    } else {
        showDialogue("ОШИБКА", choice.log, "var(--danger)", 4000);
    }

    if (!stats.isGameOver) {
        stats.step++;
        setTimeout(startScenario, 4500);
    }
}

function endGame(msg, win) {
    if (stats.isGameOver) return;
    stats.isGameOver = true;
    dialogueBox.classList.remove('visible');
    typingIndicator.style.display = 'none';

    const modal = document.getElementById('endModal');
    const actionContainer = document.getElementById('endActionContainer');
    modal.style.display = 'flex';
    
    document.getElementById('endTitle').innerText = win ? "УРОВЕНЬ ЗАВЕРШЕН" : "ИГРА ОКОНЧЕНА";
    document.getElementById('endTitle').style.color = win ? 'var(--success)' : 'var(--danger)';
    document.getElementById('endDesc').innerText = msg;
    
    document.getElementById('finalSecurity').innerText = stats.security + '%';
    document.getElementById('finalReputation').innerText = stats.reputation + '%';

    document.getElementById('educationalBlock').innerHTML = `
        <div class="edu-note">
            <h4> ПРАВИЛА:</h4>
            <p>• <strong>Никогда не переходи по ссылкам</strong> для "смены пароля" из личных сообщений.</p>
            <p>• <strong>Шантаж нельзя кормить</strong> — он только растет. Сразу блокируй и сообщай публично.</p>
            <p>• <strong>Дипфейки — реальность:</strong> научи свою аудиторию проверять информацию, прежде чем донатить.</p>
        </div>
    `;

    // Очищаем контейнер кнопок и добавляем нужную
    actionContainer.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.style.textAlign = 'center';
    btn.style.marginTop = '20px';
    btn.style.background = 'var(--accent)';

    if (win) {

        btn.innerText = 'Следующий уровень';
        btn.onclick = () => { 
            completeLevel(6);       
            setFollowers(followersByLevel[6]);
            updateFollowersUI();
            updateStats(); 
            window.location.href = 'lvl7.html'; };
    } else {
        btn.innerText = 'Попробовать снова';
        btn.onclick = () => { location.reload(); };
    }
    actionContainer.appendChild(btn);
}

