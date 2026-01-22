const newPostBtn = document.getElementById('newPostBtn');
const postOverlay = document.getElementById('postOverlay');
const closePost = document.getElementById('closePost');
const publishBtn = document.getElementById('publishBtn');
const postsGrid = document.getElementById('postsGrid');
const postsCountEl = document.getElementById('postsCount');
const postCaptionInput = document.getElementById('postCaption');
const typewriterEl = document.getElementById('typewriter');
const toastContainer = document.getElementById('toastContainer');
const explanationBad = `ОШИБКА ОШИБКА: Это было фишинговое письмо! Вы только что передали данные злоумышленникам!
 Ссылка вела на 'security-check.com', а не на 'instagram.com'. 
 Всегда проверяйте адрес сайта перед вводом данных!


Это было фишинговое письмо!
Вы перешли по ссылке и передали данные злоумышленникам.


Признаки фишинга:
• срочность («аккаунт будет заблокирован»)
• ссылка вне Instagram
• просьба ввести логин и пароль`;

const explanationGood = `Отличная работа! 


Вы НЕ перешли по ссылке и не ввели данные.
Так действуют грамотные пользователи:
• проверяют отправителя
• не переходят по срочным ссылкам
• игнорируют подозрительные сообщения`;
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

        let phishingClicked = false;

        document.getElementById('fakeConfirmBtn').onclick = () => {
            phishingClicked = true;
            closeAll();
            typewriterEl.style.color = "#ef4444";
            startTyping(explanationBad);
        };
        
       // --- Обработка правильных действий ---
        function blockChat() {
            securityBanner.style.display = 'none';
            closeAll();
             typewriterEl.style.color = "#1db225";
            startTyping("Молодец! Ты распознал угрозу и заблокировал отправителя. Официальная поддержка никогда не пишет в Директ со ссылками на сторонние домены. Вы НЕ перешли по ссылке и не ввели данные. Так действуют грамотные пользователи: • проверяют отправителя • не переходят по срочным ссылкам • игнорируют подозрительные сообщения");
            document.getElementById('supportChatItem').style.opacity = "0.3";
            document.getElementById('lastMsgPreview').textContent = "Аккаунт заблокирован";
        }

        function ignoreChat() {
            securityBanner.style.display = 'none';
            closeAll();
            typewriterEl.style.color = "#1db225";
            startTyping("Хороший выбор. Игнорирование подозрительных сообщений — первый шаг к безопасности. Помни: не нужно переходить по ссылкам от незнакомцев. Официальная поддержка никогда не пишет в Директ со ссылками на сторонние домены. Вы НЕ перешли по ссылке и не ввели данные. Так действуют грамотные пользователи: • проверяют отправителя • не переходят по срочным ссылкам • игнорируют подозрительные сообщения");
            document.getElementById('supportChatItem').remove();
        }



        

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
 