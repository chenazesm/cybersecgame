const newsFeed = document.getElementById('newsFeed');
const trustVal = document.getElementById('trustVal');
const scoreVal = document.getElementById('scoreVal');
const endModal = document.getElementById('endModal');
const phoneContainer = document.getElementById('phoneContainer');
const toast = document.getElementById('toast');

let stats = { trust: 100, step: 0, total: 7 };

const newsData = [
    {
        user: "Global_True_News",
        title: "❗ СРОЧНО: Опасность!",
        text: "Внимание! В воду попали токсичные отходы. Пить нельзя даже после кипячения. Срочно перешли это всем!",
        img: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=600&q=80",
        isFake: true,
        likes: 124502,
        reason: "Анонимный источник и требование немедленной рассылки — признаки фейка.",
        avatar: "https://img.freepik.com/premium-photo/sunrise-view-morning-mountains_38649-229.jpg"
    },
    {
        user: "BSU_Science",
        title: "Эко-прорыв в Минске",
        text: "Ученые из БГУ представили биоразлагаемый пластик на основе морских водорослей. Исчезает в почве за 14 дней.",
        img: "https://polymerbranch.com/wp-content/uploads/2026/02/gHPVTIMrDtlfQzVLwzv8XTZR1yEDaxPh.webp",
        isFake: false,
        likes: 8210,
        reason: "Новость содержит конкретные проверяемые данные и ссылается на реальный университет БГУ.",
        avatar: "https://img.freepik.com/free-vector/flat-university-building-background_23-2148186237.jpg"
    },
    {
        user: "Amazing_World",
        title: "Невероятное!",
        text: "В приюте под Омском собака заговорила на человеческом языке. На видео слышно, как она просит добавку корма.",
        img: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80",
        isFake: true,
        likes: 2340911,
        reason: "Биологически это невозможно. Подобные видео обычно являются монтажом для привлечения трафика.",
        avatar: "https://fons.grizly.club/uploads/posts/2025-06/04/thumbs/17490411207327.jpg"
    },
    {
        user: "Finance_Express",
        title: "Обновление банков!",
        text: "С завтрашнего дня вводится налог 15% на все переводы. Успейте перевести деньги близким сегодня!",
        img: "https://static2.banki.ru/ugc/4f/46/41/perevody_glavnLkbneiDEfDkBCiIoPI.jpg",
        isFake: true,
        likes: 45000,
        reason: "Финансовые законы не принимаются 'за одну ночь'. Это манипуляция чувством срочности.",
        avatar: "https://images.financialexpressdigital.com/2025/07/Untitled-design-10-1.png"
    },
    {
        user: "NASA_Webb",
        title: "Находка телескопа Webb",
        text: "Обнаружены органические молекулы в атмосфере далекой планеты. Спектральный анализ показал метан и водяной пар.",
        img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80",
        isFake: false,
        likes: 102488,
        reason: "Информация от официального ведомства NASA с описанием научного метода.",
        avatar: "https://static.wikia.nocookie.net/jamescameronsavatar/images/5/53/EarthOrbit.jpg/revision/latest?cb=20240623201047"
    },
    {
        user: "Healthy_Life",
        title: "🍎 Опасные яблоки!",
        text: "Новое исследование: красные яблоки блокируют Wi-Fi сигнал из-за высокого содержания фермента 'Роутериума'.",
        img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
        isFake: true,
        likes: 12300,
        reason: "Вымышленный фермент и антинаучное утверждение. Типичный абсурдный фейк.",
        avatar: "https://media.istockphoto.com/id/930082108/photo/solitary-lime-tree-in-fields-of-rapeseed-and-wheat-under-blue-sky.jpg?s=612x612&w=0&k=20&c=ALuNL8rkWjxYu8aCytJAoW13AdYC2Hc2DIgFbNQ6KcU="
    },
    {
        user: "Gov_Portal",
        title: "График праздников",
        text: "Правительство утвердило перенос выходных дней. Полный календарь доступен на официальном сайте ведомства.",
        img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80",
        isFake: false,
        likes: 5120,
        reason: "Обычная административная новость со ссылкой на официальный ресурс.",
        avatar: "https://images.stockcake.com/public/4/8/7/48798306-b939-47dd-9479-76773daf6fa6_large/lawyer-studying-documents-stockcake.jpg"
    }
];

function startGame() {
    document.getElementById('startOverlay').style.display = 'none';
    renderNews();
}

function showToast(msg, type) {
    toast.innerText = msg;
    toast.style.display = 'block';
    toast.style.background = type === 'success' ? 'rgba(0, 255, 136, 0.95)' : 'rgba(255, 77, 77, 0.95)';
    toast.style.color = '#000';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

function renderNews() {
    if (stats.step >= newsData.length) {
        checkEndGame();
        return;
    }

    const item = newsData[stats.step];
    newsFeed.innerHTML = `
        <div class="post-header">
            <div class="post-user-info">
                <div class="avatar"><div class="avatar-img" style="background-image:url('${item.avatar}')"></div></div>
                <span class="username">${item.user}</span>
            </div>
            <button class="btn-subscribe" id="subBtn" onclick="toggleSub()">Подписаться</button>
        </div>
        <div class="post-content-scroll">
            <div class="post-img-container">
                <div class="post-img" style="background-image: url('${item.img}')"></div>
            </div>
            
            <div class="post-actions-icons">
                <div class="left-icons">
                    <button class="icon-btn" id="likeBtn" onclick="toggleLike()"><i data-lucide="heart"></i></button>
                    <button class="icon-btn"><i data-lucide="message-circle"></i></button>
                    <button class="icon-btn"><i data-lucide="send"></i></button>
                </div>
                <button class="icon-btn" onclick="this.classList.toggle('liked')"><i data-lucide="bookmark"></i></button>
            </div>

            <div class="post-info">
                <div class="post-likes-count" id="likeCountText">${item.likes.toLocaleString()} отметок «Нравится»</div>
                <div>
                    <span class="post-title">${item.user}</span>
                    <span class="post-caption"><strong>${item.title}</strong> ${item.text}</span>
                </div>
                <div class="view-comments">Комментарии (82)</div>
            </div>
        </div>
        <div class="post-footer-actions">
            <div class="news-actions">
                <button class="btn btn-fake" onclick="verify(true)">ФЕЙК</button>
                <button class="btn btn-real" onclick="verify(false)">ВЕРЮ</button>
            </div>
        </div>
    `;
    lucide.createIcons();
    scoreVal.innerText = `${stats.step}/${stats.total}`;
}

function toggleLike() {
    const btn = document.getElementById('likeBtn');
    const countText = document.getElementById('likeCountText');
    const item = newsData[stats.step];
    btn.classList.toggle('liked');
    if(btn.classList.contains('liked')) {
        btn.innerHTML = '<i data-lucide="heart" fill="currentColor"></i>';
        countText.innerText = (item.likes + 1).toLocaleString() + ' отметок «Нравится»';
    } else {
        btn.innerHTML = '<i data-lucide="heart"></i>';
        countText.innerText = (item.likes).toLocaleString() + ' отметок «Нравится»';
    }
    lucide.createIcons();
}

function toggleSub() {
    const btn = document.getElementById('subBtn');
    btn.classList.toggle('active');
    btn.innerText = btn.classList.contains('active') ? 'Вы подписаны' : 'Подписаться';
    btn.style.color = btn.classList.contains('active') ? 'var(--text-dim)' : 'var(--accent)';
}

function verify(playerSaysFake) {
    const item = newsData[stats.step];
    const isCorrect = (playerSaysFake === item.isFake);

    if (!isCorrect) {
        stats.trust -= 25;
        updateLevelStats();
        showToast("Ошибка! Вася запутался.", "error");
    } else {
        showToast("Верно! Хороший анализ.", "success");
    }

    const overlay = document.createElement('div');
    overlay.className = 'result-overlay';
    overlay.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 25px;">${isCorrect ? '✨' : '⚠️'}</div>
        <h2 style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; margin-bottom: 15px;">
            ${isCorrect ? 'ВЕРНО' : 'ОШИБКА'}
        </h2>
        <p style="font-size: 15px; line-height: 1.6; color: #ccc; margin-bottom: 30px; max-width: 400px;">${item.reason}</p>
        <button class="btn btn-real" style="width: 250px;" onclick="nextStep()">Продолжить</button>
    `;
    phoneContainer.appendChild(overlay);
}

function nextStep() {
    stats.step++;
    const overlays = document.querySelectorAll('.result-overlay');
    overlays.forEach(o => o.remove());
    renderNews();
}

function updateLevelStats() {
    stats.trust = Math.max(0, stats.trust);
    trustVal.innerText = stats.trust + '%';

    if (stats.trust < 40) trustVal.style.color = 'var(--danger)';
    else if (stats.trust < 70) trustVal.style.color = '#ffcc00';
    else trustVal.style.color = 'var(--success)';

    if (stats.trust <= 0)
        endGame("Вася потерял способность отличать правду от вымысла. Теперь он верит всему подряд.", false);
}

function checkEndGame() {
    if (stats.trust > 0) endGame("Поздравляем! Ты помог Васе сохранить трезвый взгляд на мир и не попасться на удочку манипуляторов.", true);
}

function endGame(desc, win) {
    endModal.style.display = 'flex';
    const titleElem = document.getElementById('endTitle');
    titleElem.innerText = win ? "МИССИЯ ВЫПОЛНЕНА" : "ИГРА ОКОНЧЕНА";
    titleElem.style.color = win ? 'var(--success)' : 'var(--danger)';
    document.getElementById('endDesc').innerText = desc;
    
    const container = document.getElementById('actionBtnContainer');
    container.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.width = '100%';
    btn.style.background = 'var(--accent)';
    if (win) {
           completeLevel(8);       
            setFollowers(followersByLevel[8]);
            updateFollowersUI();
            updateStats();
        btn.innerText = "К следующему уровню";
        btn.onclick = () => { window.location.href = 'lvl9.html'; };
    } else {
        btn.innerText = "Попробовать снова";
        btn.onclick = () => { location.reload(); };
    }
    container.appendChild(btn);
}
