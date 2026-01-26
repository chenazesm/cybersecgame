function animateNumbers(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function closeDM() {
    const chat = document.getElementById('chatOverlay');
    if (chat) {
        chat.classList.remove('open');
        setTimeout(() => chat.style.display = 'none', 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newPostBtn = document.getElementById('newPostBtn');
    if (newPostBtn) newPostBtn.onclick = (e) => e.preventDefault();

    setTimeout(() => {
        if (typeof startTyping === 'function') {
            startTyping("Твой аккаунт постепенно развивается. Популярность растет на глазах!");
        }

        animateNumbers("followersCount", 125, 1250, 4000);
        animateNumbers("followingCount", 54, 540, 4000);
    }, 1000); 

    setTimeout(() => {
        const badge = document.getElementById('badge');
        if (badge) badge.style.display = 'flex';
        
        let container = document.getElementById('toastContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.display = 'flex'; // Гарантируем видимость
        toast.innerHTML = `<strong>HypeManager_Bot</strong><br><small>У вас новое сообщение!</small>`;
        
        toast.onclick = () => {
            toast.remove();
            const chat = document.getElementById('chatOverlay');
            if (chat) {
                chat.style.display = 'flex';
                setTimeout(() => chat.classList.add('open'), 10);
                if (typeof startTyping === 'function') {
                    startTyping("Кто-то предлагает тебе легкий способ стать еще популярнее. Будь осторожен.");
                }
            }
        };
        container.appendChild(toast);
        
    }, 5500);

    const scamLink = document.getElementById('scamLink');
    if (scamLink) {
        scamLink.onclick = (e) => {
            e.preventDefault();
            closeDM();
            if (typeof startTyping === 'function') {
                startTyping("ОШИБКА! Это был типичный скам. Ты ввел данные на подозрительном сайте, надеясь на легкие деньги. Аккаунт потерян.", () => {
                    const curtain = document.getElementById('curtain');
                    if (curtain) {
                        curtain.innerHTML = '<div class="game-over-text">Тебя обманули!<br>Легких денег не бывает.</div>';
                        curtain.classList.remove('fade-out');
                        setTimeout(() => {
                            const goText = curtain.querySelector('.game-over-text');
                            if(goText) goText.style.opacity = '1';
                        }, 100);
                        setTimeout(() => location.reload(), 4000);
                    }
                });
            }
        };
    }
});