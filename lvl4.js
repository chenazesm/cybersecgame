const commentsArea = document.getElementById('commentsArea');
const logText = document.getElementById('logText');
const moodDisplay = document.getElementById('moodDisplay');
const moodBar = document.getElementById('moodBar');
const modal = document.getElementById('actionModal');
const body = document.getElementById('gameBody');
const postOverlay = document.getElementById('postOverlay');
const profileView = document.getElementById('profileView');
const tutorialOverlay = document.getElementById('tutorialOverlay');

let mood = 100;
let activeIdx = -1;
let gameActive = false;
let simulationStarted = false; 
let spawnInterval = null;
let processedCommentsCount = 0;

const events = [
    { user: "toxic_mike", text: "Ужасное фото, ты бездарность. Уйди из интернета! 🤡", type: "toxic" },
    { user: "kate_sweet", text: "Вася, ты такой крутой! Обожаю твои посты! ❤️", type: "positive" },
    { user: "anonymous_99", text: "Я знаю, где ты живешь. Жди гостей на ул. Центральная 🔪", type: "threat" },
    { user: "click_master", text: "ВЫИГРАЙ 10000$ ПО ССЫЛКЕ В МОЕМ ПРОФИЛЕ!!! 🎰", type: "spam" },
    { user: "vlad_p", text: "Опять реклама? Ты продался, смотреть противно.", type: "toxic" },
    { user: "helper_bot", text: "Если вам нужна помощь с монтажом, пишите в директ!", type: "positive" },
    { user: "scam_checker", text: "Вася, твой аккаунт будет заблокирован. Подтверди данные здесь: bit.ly/fake-inst", type: "scam" },
    { user: "best_fan", text: "Не слушай хейтеров, они просто завидуют успеху!", type: "positive" }
];


let currentIdx = 0;

function updateLog(msg) {
    logText.innerText = msg;
}

function updateMood(change) {
    mood = Math.max(0, Math.min(100, mood + change));
    
    // ЛОГИКА ТЕНИ ВОЛНЕНИЯ (Shadow Vignette)
    if (mood <= 45) {
        stressVignette.classList.add('active-stress');
        // Усиливаем интенсивность тени в зависимости от критичности
        let intensity = (45 - mood) * 2; 
        stressVignette.style.boxShadow = `inset 0 0 ${60 + intensity}px rgba(237, 73, 86, 0.6)`;
    } else {
        stressVignette.classList.remove('active-stress');
        stressVignette.style.boxShadow = `inset 0 0 100px rgba(237, 73, 86, 0)`;
    }

    let emoji = "😊";
    let color = "var(--success-green)";
    
    body.classList.remove('stress-mode');

    if (mood < 70) { emoji = "😐"; color = "var(--warning-yellow)"; }
    if (mood <= 45) { emoji = "😟"; color = "var(--danger-red)"; }
    if (mood <= 25) { emoji = "😭"; color = "#721c24"; }
    
    if (mood <= 20 && simulationStarted) {
        gameOver();
    }

    moodDisplay.innerText = `${emoji} ${mood}%`;
    moodBar.style.width = `${mood}%`;
    moodBar.style.backgroundColor = color;
}


function spawnComment() {
    if(!simulationStarted || currentIdx >= events.length) return;

    const e = events[currentIdx];
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.id = `comment-${currentIdx}`;
    div.innerHTML = `
        <div style="display: flex; flex-direction: column;">
            <div><span class="comment-user">${e.user}</span><span>${e.text}</span></div>
            <span class="comment-btn" id="btn-${currentIdx}" onclick="openModal(${currentIdx})">Принять решение</span>
        </div>
    `;
    commentsArea.appendChild(div);
    commentsArea.scrollTop = commentsArea.scrollHeight;

    if(e.type === 'toxic' || e.type === 'threat' || e.type === 'scam') {
        updateMood(-10);
    } else if(e.type === 'spam') {
        updateMood(-5);
    } else {
        updateMood(2);
    }
    currentIdx++;
}

function startGame() {
    document.getElementById('startOverlay').style.display = 'none';
    document.getElementById('restartOverlay').style.display = 'none';
    document.getElementById('winOverlay').style.display = 'none';
    tutorialOverlay.style.display = 'none';
    
    gameActive = true;
    simulationStarted = false;
    mood = 100;
    currentIdx = 0;
    processedCommentsCount = 0;
    commentsArea.innerHTML = '';
    postOverlay.style.display = 'none';
    profileView.style.opacity = '1';
    
    updateMood(0);
    updateLog("Вася ждет. Нажми на новый пост в профиле, чтобы начать модерацию.");
}

function openPost() {
    if (!gameActive || simulationStarted) return;
    
    // Показываем оверлей с советами прежде чем запустить игру
    tutorialOverlay.style.display = 'flex';
    profileView.style.opacity = '0.3';
}

function startSimulation() {
    tutorialOverlay.style.display = 'none';
    postOverlay.style.display = 'flex';
    simulationStarted = true;
    
    updateLog("Фильтруй комментарии в реальном времени!");
    
    if(spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnComment, 3500);
    spawnComment(); 
}

function restartGame() {

  window.location.reload();
}

function gameOver() {
    simulationStarted = false;
    gameActive = false;
    clearInterval(spawnInterval);
    document.getElementById('restartOverlay').style.display = 'flex';
}

function checkWinCondition() {
    if (processedCommentsCount >= events.length && mood > 20) {
        simulationStarted = false;
        gameActive = false;
        clearInterval(spawnInterval);

                    
        completeLevel(4);       
        setFollowers(followersByLevel[4]);
        updateFollowersUI();
        updateStats();
        setTimeout(() => {
            document.getElementById('winOverlay').style.display = 'flex';
        }, 1000);
    }
}

function openModal(idx) {
    if (!simulationStarted) return;
    activeIdx = idx;
    const e = events[idx];
    document.getElementById('modalText').innerText = `Анализ сообщения от ${e.user}: \n"${e.text}"`;
    modal.style.display = 'flex';
}

function takeAction(action) {
    if (!simulationStarted) return;
    const e = events[activeIdx];
    const element = document.getElementById(`comment-${activeIdx}`);
    const btn = document.getElementById(`btn-${activeIdx}`);
    modal.style.display = 'none';

    if(action === 'report') {
        updateLog("Жалоба отправлена. Настроение Васи улучшилось.");
        updateMood(12);
        if(element) {
            element.innerHTML = '<i>[Комментарий скрыт после жалобы]</i>';
            element.style.opacity = '0.4';
        }
    } else if(action === 'delete') {
        updateLog("Комментарий удален. В ленте стало чище.");
        updateMood(8);
        if(element) element.remove();
    } else if(action === 'reply') {
        if(e.type === 'positive') {
            updateLog("Вася ответил фанату! Поддержка очень важна.");
            updateMood(15);
        } else {
            updateLog("Вася начал спорить с хейтером. Это огромный стресс!");
            updateMood(-25);
        }
    } else if(action === 'ignore') {
        if(e.type === 'toxic' || e.type === 'threat') {
            updateLog("ТАКТИКА: Игнорирование — лучший способ борьбы с троллями.");
            updateMood(7);
            if(element) element.style.opacity = '0.6';
        } else {
            updateLog("Проигнорирован обычный комментарий.");
        }
    }

    if (btn) {
        btn.innerText = "Решено";
        btn.style.color = "#a8a8a8";
        btn.style.pointerEvents = "none";
        btn.style.background = "transparent";
    }
    
    processedCommentsCount++;
    checkWinCondition();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}