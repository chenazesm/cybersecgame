lucide.createIcons();

// Обновленные вопросы (убраны геометки, добавлены актуальные ИБ-вопросы)
const quizData = [
    { q: "Какой пароль самый надежный для входа в аккаунт?", a: ["vasya2009", "12345678", "V@sya_20!0_#Secure", "qwerty"], correct: 2 },
    { q: "Что делать, если пришла ссылка на 'бесплатные монеты' от друга?", a: ["Сразу перейти", "Связаться с другом по другому каналу связи и проверить", "Игнорировать", "Отправить данные карты"], correct: 1 },
    { q: "Зачем нужно регулярно устанавливать обновления ОС и приложений?", a: ["Чтобы появились новые стикеры", "Для закрытия найденных уязвимостей безопасности", "Чтобы телефон быстрее разряжался", "Это маркетинг, обновления не нужны"], correct: 1 },
    { q: "Двухфакторная аутентификация (2FA) — это...", a: ["Лишняя трата времени", "Способ входа через два разных смартфона", "Дополнительный слой защиты (например, код из приложения-аутентификатора)", "Вирус, блокирующий вход"], correct: 2 },
    { q: "Для чего нужны Менеджеры Паролей?", a: ["Чтобы подбирать пароли к чужим Wi-Fi", "Генерировать и безопасно хранить сложные уникальные пароли", "Для автоматического лайкания постов", "Это платный антивирус"], correct: 1 },
    { q: "Как распознать фейковую новость в ленте?", a: ["По яркому заголовку 'ШОК!'", "По количеству лайков", "Найти первоисточник и проверить факты в официальных СМИ", "Если все друзья переслали, значит правда"], correct: 2 },
    { q: "Что такое 'Фишинг'?", a: ["Ловля рыбы в игре", "Кража данных пользователя через поддельные сайты и письма", "Общение в голосовом чате", "Установка антивируса"], correct: 1 },
    { q: "Можно ли подключаться к открытому Wi-Fi в кафе или метро для входа в онлайн-банк?", a: ["Да, это удобно и экономит трафик", "Только если сигнал очень хороший", "Нет, публичные сети легко перехватить", "Да, если включен режим инкогнито"], correct: 2 },
    { q: "Что такое 'Социальная инженерия' в контексте кибербезопасности?", a: ["Построение сетей для офиса", "Манипуляция психологией людей с целью выведать конфиденциальную информацию", "Продвижение соцсетей", "Шифрование данных"], correct: 1 },
    { q: "Кто несет главную ответственность за твою безопасность в сети?", a: ["Разработчики приложений", "Полиция", "Ты сам и твои цифровые привычки", "Антивирусная программа"], correct: 2 }
];

let currentStep = 0;
let score = 0;
let health = 100;
const damagePerMistake = 100 / quizData.length;

// Элементы игры
const player = document.getElementById('vasyaPlayer');
const enemy = document.getElementById('enemyEntity');
const combatText = document.getElementById('combatText');
const hpFill = document.getElementById('hpFill');
const enemyIcons = ['💣', '⚠️', '👾', '💣', '⚠️', '👾', '💣', '⚠️', '👾', '💣'];

function startQuiz() {
    document.getElementById('startOverlay').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    updateGamePositions(true);
    renderQuestion();
}

function updateGamePositions(initial = false) {
    // Расчет позиций (от 5% до 85% ширины экрана)
    const progressRatio = currentStep / quizData.length;
    const playerPos = 5 + (progressRatio * 70); 
    const enemyPos = playerPos + 18; // Враг всегда чуть впереди
    
    player.style.left = playerPos + '%';
    
    // Если дошли до конца
    if(currentStep >= quizData.length) {
        enemy.style.opacity = 0;
        return;
    }

    // Сброс и установка нового врага
    enemy.className = 'enemy-char';
    enemy.style.opacity = 0;
    
    setTimeout(() => {
        enemy.innerText = enemyIcons[currentStep % enemyIcons.length];
        enemy.style.left = enemyPos + '%';
        enemy.style.opacity = 1;
    }, initial ? 0 : 300);
}

function renderQuestion() {
    const card = document.getElementById('qCard');
    const data = quizData[currentStep];
    
    card.style.opacity = 0;
    card.style.transform = "translateY(10px)";

    setTimeout(() => {
        document.getElementById('pFill').style.width = ((currentStep) / quizData.length * 100) + '%';

        card.innerHTML = `
            <p style="color:var(--accent); font-weight:700; margin-bottom:10px; font-size: 14px; letter-spacing: 1px;">
                СИСТЕМНЫЙ БАРЬЕР ${currentStep + 1} / ${quizData.length}
            </p>
            <h2 class="q-title">${data.q}</h2>
            <div class="options">
                ${data.a.map((opt, i) => `
                    <button class="opt-btn" onclick="handleAnswer(${i})">${opt}</button>
                `).join('')}
            </div>
        `;
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
    }, 300);
}

function showCombatFeedback(text, color) {
    combatText.innerText = text;
    combatText.style.color = color;
    combatText.style.textShadow = `0 0 10px ${color}`;
    
    // Сброс анимации
    combatText.classList.remove('anim-combat-text');
    void combatText.offsetWidth; // trigger reflow
    combatText.classList.add('anim-combat-text');
}

function handleAnswer(idx) {
    const data = quizData[currentStep];
    const btns = document.querySelectorAll('.opt-btn');
    
    // Отключаем кнопки
    btns.forEach(b => { b.disabled = true; });

    const isCorrect = (idx === data.correct);

    if(isCorrect) {
        btns[idx].classList.add('correct');
        score++;
        
        // Анимация успеха
        player.classList.add('anim-attack');
        setTimeout(() => enemy.classList.add('anim-die'), 200);
        showCombatFeedback("УГРОЗА УНИЧТОЖЕНА", "var(--success)");

    } else {
        btns[idx].classList.add('wrong');
        btns[data.correct].classList.add('correct');
        
        // Урон
        health -= damagePerMistake;
        hpFill.style.width = Math.max(0, health) + '%';
        if(health <= 50) hpFill.style.background = "var(--gold)";
        if(health <= 20) hpFill.style.background = "var(--danger)";

        // Анимация провала
        enemy.classList.add('anim-enemy-attack');
        setTimeout(() => player.classList.add('anim-hurt'), 200);
        showCombatFeedback("СИСТЕМА ПОВРЕЖДЕНА!", "var(--danger)");
    }

    // Переход к следующему шагу
    setTimeout(() => {
        player.className = 'player-char'; // Очистка классов анимации
        currentStep++;
        
        updateGamePositions();

        if(currentStep < quizData.length) {
            renderQuestion();
        } else {
            setTimeout(showFinal, 800); // Даем Васе дойти до галочки
        }
    }, 1800); // Пауза чтобы насладиться анимацией
}

function showFinal() {
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('victorySection').style.display = 'block';
    
    document.getElementById('finalScoreDisplay').innerText = `${score}/${quizData.length}`;
    document.getElementById('finalHpDisplay').innerText = `${Math.ceil(health)}%`;
    
    const rank = document.getElementById('finalRank');
    const message = document.getElementById('finalMessage');
       completeLevel(10);       
            setFollowers(followersByLevel[10]);
            updateFollowersUI();
            updateStats();

    if(health === 100) {
        rank.innerText = "Cyber Legend";
        rank.style.color = "var(--success)";
        message.innerText = "Идеально! Вася — гуру безопасности!";
    } else if (health >= 60) {
        rank.innerText = "Advanced User";
        rank.style.color = "var(--gold)";
        message.innerText = "Хороший результат! Статус геймера получен.";
    } else {
        rank.innerText = "Lucky Survivor";
        rank.style.color = "var(--danger)";
        message.innerText = "Чудом выжили! Статус геймера дали авансом.";
    }

    celebrate();
}

function celebrate() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function celebrateAgain() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0095f6', '#00ff88', '#FFD700'] });
}