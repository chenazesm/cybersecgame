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

        function closeAll() {
            postOverlay.classList.remove('open');
            chatOverlay.classList.remove('open');
            setTimeout(() => {
                postOverlay.style.display = 'none';
                chatOverlay.style.display = 'none';
            }, 300);
        }

        document.getElementById('newPostBtn').addEventListener('click', () => {
            postOverlay.style.display = 'flex';
            setTimeout(() => postOverlay.classList.add('open'), 10);
        });

        document.getElementById('publishBtn').addEventListener('click', () => {
            const grid = document.getElementById('postsGrid');
            const item = document.createElement('div');
            item.className = 'post-item';
            item.style.backgroundColor = '#1e293b';
            grid.prepend(item);
            
            document.getElementById('postsCount').innerText = grid.children.length;
            closeAll();
            startTyping("Публикация создана! Подождите немного...");

            // Создаем фишинговое уведомление через 3 секунды
            setTimeout(showNotification, 3000);
        });

        function showNotification() {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<strong>Instagram Security</strong><br><small>Срочное сообщение по безопасности!</small>`;
            
            toast.onclick = () => {
                toast.remove();
                chatOverlay.style.display = 'flex';
                setTimeout(() => chatOverlay.classList.add('open'), 10);
            };
            
            container.appendChild(toast);
        }

        document.getElementById('fakeConfirmBtn').onclick = () => {
            closeAll();
            typewriterEl.style.color = "#ef4444";
            startTyping("ОШИБКА: Это было фишинговое письмо! Вы только что передали данные злоумышленникам.");
        };

        function startTyping(text) {
            typewriterEl.textContent = "";
            let i = 0;
            const interval = setInterval(() => {
                if(i < text.length) {
                    typewriterEl.textContent += text[i];
                    i++;
                } else clearInterval(interval);
            }, 30);
        }

        window.onload = () => startTyping("Помогите Васе сделать первую публикацию в Instagram.");
 