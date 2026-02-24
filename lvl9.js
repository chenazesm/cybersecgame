lucide.createIcons();

const feedContainer = document.getElementById('feedPosts');
const vasyaMarker = document.getElementById('vasyaMarker');
const stalkerMarker = document.getElementById('stalkerMarker');
const geoToggle = document.getElementById('geoToggle');
const notifContainer = document.getElementById('notifContainer');
const logText = document.getElementById('logText');
const msgTime = document.getElementById('msgTime');

let isGeoOn = true;
let isHistoryClean = false;
let gameActive = false;
let stalkerSpeed = 0.25; // Сделано медленнее
let stalkerPos = { x: 15, y: 15 };
let vasyaPos = { x: 50, y: 50 };
let stalkerInterval;

const postData = [
    { user: 'vasya_player_1', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', loc: 'ул. Ленина 5', text: 'Утренний стрим прошел на ура! 🎮' },
    { user: 'vasya_player_1', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500', loc: 'Фитнес-клуб "Титан"', text: 'Держим форму! 💪' },
    { user: 'vasya_player_1', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', loc: 'Кафе "Ромашка"', text: 'Обед по расписанию 🍔' },
    { user: 'vasya_player_1', img: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=500', loc: 'Парк', text: 'Гуляю перед турниром...' }
];

function startGame() {
    document.getElementById('startOverlay').style.display = 'none';
    gameActive = true;
    renderFeed();
    startStalker();
    updateMsgTime();
    
    setInterval(() => {
        if(!gameActive) return;
        if (isGeoOn || !isHistoryClean) {
            vasyaPos.x = Math.max(15, Math.min(85, vasyaPos.x + (Math.random() - 0.5) * 10));
            vasyaPos.y = Math.max(15, Math.min(85, vasyaPos.y + (Math.random() - 0.5) * 10));
            updateVasyaPos();
        }
    }, 3000);
}

function updateMsgTime() {
    const now = new Date();
    msgTime.innerText = now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');
}

function navTo(screenName) {
    document.querySelectorAll('.phone-modal').forEach(el => el.style.display = 'none');
    const target = document.getElementById('screen' + screenName.charAt(0).toUpperCase() + screenName.slice(1));
    if (target) target.style.display = 'flex';
    lucide.createIcons();
}

function renderFeed() {
    feedContainer.innerHTML = '';
    postData.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post-item';
        div.innerHTML = `
            <div class="post-top"><div class="avatar-circle"></div><div>
                <div style="font-weight:700; font-size:13px">${post.user}</div>
                ${(isGeoOn && !isHistoryClean) ? `<div class="post-geo"><i data-lucide="map-pin" size="10"></i> ${post.loc}</div>` : ''}
            </div></div>
            <div class="post-img" style="background-image: url('${post.img}')"></div>
            <div class="post-actions"><i data-lucide="heart" size="22" color="#fff"></i><i data-lucide="message-circle" size="22" color="#fff"></i><i data-lucide="send" size="22" color="#fff"></i></div>
            <div class="post-text"><b>${post.user}</b> ${post.text}</div>
        `;
        feedContainer.appendChild(div);
    });
    lucide.createIcons();
}

function toggleGeo() {
    if (!isGeoOn) return; 
    isGeoOn = false;
    geoToggle.classList.add('off');
    document.getElementById('task1').classList.add('done');
    logText.innerText = "Я потерял твой свежий сигнал... Но я помню, где ты был раньше. Ты не спрячешься!";
    updateMsgTime();
    renderFeed();
    checkWin();
}

function clearHistory() {
    if (isHistoryClean) return;
    isHistoryClean = true;
    document.getElementById('task2').classList.add('done');
    showNotif("История очищена", "success");
    logText.innerText = "Где ты?! Карта пуста... Я найду тебя по другим следам!";
    updateMsgTime();
    vasyaMarker.style.opacity = '0.2';
    renderFeed();
    checkWin();
}

function checkWin() {
    if (!isGeoOn && isHistoryClean) {
        endGame(true);
    }
}

function startStalker() {
    stalkerInterval = setInterval(() => {
        if(!gameActive) return;

        if (isGeoOn || !isHistoryClean) {
            const dx = vasyaPos.x - stalkerPos.x;
            const dy = vasyaPos.y - stalkerPos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 4) {
                endGame(false);
                return;
            }

            stalkerPos.x += (dx / dist) * stalkerSpeed;
            stalkerPos.y += (dy / dist) * stalkerSpeed;
            stalkerSpeed += 0.001; // Очень медленное ускорение
        } else {
            stalkerPos.x += (Math.random() - 0.5) * 1;
            stalkerPos.y += (Math.random() - 0.5) * 1;
        }
        updateStalkerPos();
    }, 100);
}

function updateVasyaPos() {
    vasyaMarker.style.left = vasyaPos.x + '%';
    vasyaMarker.style.top = vasyaPos.y + '%';
}

function updateStalkerPos() {
    stalkerMarker.style.left = stalkerPos.x + '%';
    stalkerMarker.style.top = stalkerPos.y + '%';
}

function showNotif(text, type) {
    const n = document.createElement('div');
    n.className = 'notif';
    n.style.borderLeft = `4px solid ${type === 'error' ? 'var(--danger)' : 'var(--success)'}`;
    n.innerHTML = `<i data-lucide="${type === 'error' ? 'alert-circle' : 'check-circle'}" color="${type === 'error' ? 'var(--danger)' : 'var(--success)'}"></i><span>${text}</span>`;
    notifContainer.appendChild(n);
    lucide.createIcons();
    setTimeout(() => n.remove(), 3500);
}

function endGame(win) {
    gameActive = false;
    clearInterval(stalkerInterval);
    const modal = document.getElementById('endModal');
    const card = document.getElementById('endCard');
    modal.style.display = 'flex';
    card.className = win ? 'alert-card win-card' : 'alert-card';


    if (win) {
        
        document.getElementById('endTitle').innerText = "ВАСЯ В БЕЗОПАСНОСТИ";
        document.getElementById('endText').innerHTML = "Вася больше не делится свой геопозицией. Сталкер в замешательстве, а данные надежно защищены!";
        document.getElementById('endBtn').className = "btn btn-primary";
        document.getElementById('endBtn').innerText = "ФИНАЛ";
           completeLevel(9);       
            setFollowers(followersByLevel[9]);
            updateFollowersUI();
            updateStats();
        // Переход на следующий уровень
        endBtn.onclick = function () {
            window.location.href = "lvl10.html";
        };
    } else {
        
        document.getElementById('endTitle').innerText = "ВАСЮ НАШЛИ";
        document.getElementById('endText').innerHTML = "Сталкер сопоставил геометки постов и нашел адрес Васи. Небрежность в сети стоит дорого.";
        document.getElementById('endBtn').className = "btn btn-danger";
        document.getElementById('endBtn').innerText = "ПОПРОБОВАТЬ СНОВА";
    }
}



    // Random taunts
setInterval(() => {
    if(gameActive && (isGeoOn || !isHistoryClean)) {
        const taunts = [ "Ты всегда обедаешь в это время?", "Хороший парк, я уже на входе.", "Я уже совсем близко"];

        logText.innerText = taunts[Math.floor(Math.random()*taunts.length)];
        
    }
}, 8000);