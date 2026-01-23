// lvl2.js

// Переменные элементов
const newPostBtn = document.getElementById('newPostBtn');
const postOverlay = document.getElementById('postOverlay');
const closePost = document.getElementById('closePost');
const publishBtn = document.getElementById('publishBtn');
const postsGrid = document.getElementById('postsGrid');
const postsCountEl = document.getElementById('postsCount');
const postCaptionInput = document.getElementById('postCaption');
const typewriterEl = document.getElementById('typewriter');
const toastContainer = document.getElementById('toastContainer');
const chatOverlay = document.getElementById('chatOverlay');
const securityBanner = document.getElementById('securityBanner');

// Тексты
const explanationBad = `ОШИБКА: Это было фишинговое письмо! Вы только что перешли по фишинговой ссылке!
 Она вела на 'security-check.com', а не на 'instagram.com'. 
 Всегда проверяйте адрес сайта перед вводом данных!`;

const explanationGood = `Отличная работа! 
Вы НЕ перешли по ссылке и не ввели данные.
Так действуют грамотные пользователи: проверяют отправителя, не переходят по срочным ссылкам.`;

// --- ФУНКЦИИ УПРАВЛЕНИЯ ОКНАМИ ---

function closeAll() {
    if(postOverlay) {
        postOverlay.classList.remove('open');
        setTimeout(() => postOverlay.style.display = 'none', 300);
    }
    if(chatOverlay) {
        chatOverlay.classList.remove('open');
        setTimeout(() => chatOverlay.style.display = 'none', 300);
    }
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Запускаем текст задачи (Используем глобальную функцию из script.js)
    if (typeof startTyping === 'function') {
        startTyping("Помогите Васе сделать первую публикацию в Instagram.");
    }

    // 2. Убираем шторку
    const curtain = document.getElementById('curtain');
    if (curtain) {
        setTimeout(() => {
            curtain.classList.add('fade-out');
        }, 500);
    }

    let postClickCount = 0;
    if(newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            
            if (postClickCount >= 1) { 
                return; 
            }
            postClickCount++;

            postOverlay.style.display = 'flex';
            setTimeout(() => postOverlay.classList.add('open'), 10);
        });
    }

    // 4. Закрытие поста
    if(closePost) {
        closePost.addEventListener('click', closeAll);
    }

    // 5. Публикация поста
    if(publishBtn) {
        publishBtn.addEventListener('click', () => {
            const grid = document.getElementById('postsGrid');
            const item = document.createElement('div');
            item.className = 'post-item';
            // item.style.backgroundImage = ... (если нужно)
            item.style.backgroundColor = '#1e293b'; // Заглушка
            
            if(grid) {
                grid.prepend(item);
                document.getElementById('postsCount').innerText = grid.children.length;
            }
            
            closeAll();
            
            if (typeof startTyping === 'function') {
                startTyping("Публикация создана! Подождите немного...");
            }

            // Создаем фишинговое уведомление через 3 секунды
            setTimeout(showNotification, 3000);
        });
    }
});

// --- ФУНКЦИИ УВЕДОМЛЕНИЙ И ЧАТА ---

function showNotification() {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>Instapic Security</strong><br><small>Срочное сообщение по безопасности!</small>`;
    
    toast.onclick = () => {
        toast.remove();
        if(chatOverlay) {
            chatOverlay.style.display = 'flex';
            setTimeout(() => chatOverlay.classList.add('open'), 10);
        }
    };
    
    container.appendChild(toast);
}

// Клик по фишинговой ссылке (ПЛОХО)
const fakeBtn = document.getElementById('fakeConfirmBtn');
if(fakeBtn) {
    fakeBtn.onclick = () => {
        closeAll(); // Закрываем чат
        if(typewriterEl) typewriterEl.style.color = "#ffffff"; // Красный текст
        
        if (typeof startTyping === 'function') {
            startTyping(explanationBad, () => {
                
                const curtain = document.getElementById('curtain');
                
                curtain.innerHTML = '<div class="game-over-text">Неудачная попытка.<br>Попробуйте снова</div>';
                
                curtain.classList.remove('fade-out');
                
                setTimeout(() => {
                    const goText = curtain.querySelector('.game-over-text');
                    if(goText) goText.style.opacity = '1';
                }, 100);

                setTimeout(() => {
                    location.reload();
                }, 3000);
            });
        }
    };
}

// Кнопка "Заблокировать" (ХОРОШО)
function blockChat() {
    if(securityBanner) securityBanner.style.display = 'none';
    closeAll();
    if(typewriterEl) typewriterEl.style.color = "#1db225"; // Зеленый
    if (typeof startTyping === 'function') startTyping(explanationGood);
    
    // Визуально блокируем чат
    const chatItem = document.querySelector('.chat-item.active'); // или по ID
    if(chatItem) chatItem.style.opacity = "0.3";
}

// Кнопка "Удалить/Игнорировать" (ХОРОШО)
function ignoreChat() {
    if(securityBanner) securityBanner.style.display = 'none';
    closeAll();
    if(typewriterEl) typewriterEl.style.color = "#1db225";
    if (typeof startTyping === 'function') startTyping(explanationGood);
}