document.addEventListener('DOMContentLoaded', () => {

    // 1. ЗАПУСК ТЕКСТА ЗАДАЧИ
    setTimeout(() => {
        if (typeof startTyping === 'function') {
            startTyping("Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic.");
        }
    }, 1000); 


    // 2. ОШИБКА ПРИ ВВОДЕ (ЛОГИН)
    const errorMsg = document.getElementById('error-msg');
    let errorTimeout;
    const loginInputs = document.querySelectorAll('.login-form input'); 

    loginInputs.forEach(input => {
        input.addEventListener('input', () => {
            const loginView = document.getElementById('login-view');
            // Если мы в блоке логина
            if(loginView && getComputedStyle(loginView).display !== 'none') {
                 if(errorMsg) {
                    errorMsg.innerText = "Сначала нужно зарегистрироваться!";
                    errorMsg.classList.add('visible');
                    clearTimeout(errorTimeout);
                    errorTimeout = setTimeout(() => errorMsg.classList.remove('visible'), 2000);
                 }
            }
        });
    });


    // 3. ПЕРЕХОД К РЕГИСТРАЦИИ
    const regLink = document.getElementById('reg-link');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');

    if (regLink) {
        regLink.addEventListener('click', (e) => {
            e.preventDefault();
            regLink.innerHTML = '<span class="mac-spinner"></span>';
            
            setTimeout(() => {
                if(loginView) loginView.style.display = 'none';
                if(registerView) registerView.style.display = 'block';
                startTyping("Отлично. Теперь заполни свою информацию.");
            }, 500); 
        });
    }


    // 4. ХАКЕРСКИЙ ВВОД (АВТОЗАПОЛНЕНИЕ)
    const hackerInputs = document.querySelectorAll('input[data-target]');
    
    hackerInputs.forEach(input => {
        // Пропускаем поле пароля
        if (input.id === 'reg-pass') return; 

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' || e.key === 'Tab' || e.key.includes('Arrow')) return; 
            e.preventDefault();
            const targetText = this.getAttribute('data-target');
            const currentLength = this.value.length;
            if (currentLength < targetText.length) {
                this.value += targetText.charAt(currentLength);
                this.dispatchEvent(new Event('input'));
            }
        });
        input.addEventListener('paste', (e) => e.preventDefault());
    });


    // 5. НАПОМИНАНИЕ ПРО ПАРОЛЬ
    const passInput = document.getElementById('reg-pass');
    const taskTitle = document.querySelector('.task-title');

    if (passInput) {
        passInput.addEventListener('focus', () => {
            if (taskTitle) {
                taskTitle.innerText = "НАПОМИНАНИЕ";
                taskTitle.style.color = "#f59e0b"; 
            }
            startTyping("Используй надежный пароль! Минимум 8 символов, заглавные буквы и цифры. Никогда не используй свою дату рождения.");
        }, { once: true }); 
    }

    // РАСЧЕТ ВРЕМЕНИ ВЗЛОМА
    function calculatePasswordTime(password) {
        let charset = 0;
        if (/[a-z]/.test(password)) charset += 26;
        if (/[A-Z]/.test(password)) charset += 26;
        if (/[0-9]/.test(password)) charset += 10;
        if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

        if (charset === 0) return "0 секунд";

        const combinations = BigInt(charset) ** BigInt(password.length);
        const speedPerSecond = 1_000_000_000n; 
        
        let seconds = Number(combinations / speedPerSecond);

        if (seconds < 1) return "мгновенно";
        if (seconds < 60) return Math.ceil(seconds) + " секунд";
        
        let minutes = seconds / 60;
        if (minutes < 60) return Math.ceil(minutes) + " минут";
        
        let hours = minutes / 60;
        if (hours < 24) return Math.ceil(hours) + " часов";
        
        let days = hours / 24;
        if (days < 30) return Math.ceil(days) + " дней";
        
        let months = days / 30;
        if (months < 12) return Math.ceil(months) + " месяцев";
        
        let years = days / 365;
        if (years < 1000) return Math.ceil(years) + " лет";
        
        return "тысячу лет";
    }


    // 6. КНОПКА РЕГИСТРАЦИИ 
    const btnRegister = document.getElementById('btn-register');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userRealNameSpan = document.getElementById('user-real-name');
    
    const regWrapper = document.getElementById('register-view');
    const inputPhone = document.getElementById('reg-phone');
    const inputName = document.getElementById('reg-name');
    const inputUser = document.getElementById('reg-username');
    const inputPass = document.getElementById('reg-pass');

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            // Проверка на пустоту
            if (!inputPhone.value || !inputName.value || !inputUser.value || !inputPass.value) {
                alert("Заполните все поля!"); 
                return;
            }

            // --- ПРОВЕРКА НАДЕЖНОСТИ ПАРОЛЯ ---
            const timeToCrack = calculatePasswordTime(inputPass.value);
            
            if (timeToCrack.includes("секунд") || timeToCrack.includes("минут") || timeToCrack.includes("часов") || timeToCrack.includes("дней") || timeToCrack.includes("мгновенно")) {
                
                if (taskTitle) {
                    taskTitle.innerText = "УГРОЗА";
                    taskTitle.style.color = "#ff5f56";
                }
                
                startTyping(`Ты уверен? Пароль недостаточно надежен. К слову, чтобы его взломать, мошеннику понадобится около ${timeToCrack}. Попробуй добавить заглавные буквы или символы.`);
                
                return; 
            }

            // Сохранение
            const userData = {
                phone: inputPhone.value,
                realName: inputName.value,
                username: inputUser.value,
                password: inputPass.value
            };
            localStorage.setItem('gameUserData', JSON.stringify(userData));

            // Анимация загрузки
            btnRegister.innerHTML = '<span class="mac-spinner" style="filter: brightness(10)"></span>';
            
            setTimeout(() => {
                // 1. Скрываем регистрацию и картинки
                if(registerView) registerView.style.display = 'none';
                const visuals = document.querySelector('.visuals');
                if(visuals) visuals.style.display = 'none';
                
                // Скрываем диалог на время приветствия
                const dialogueBox = document.querySelector('.dialogue-box');
                if(dialogueBox) dialogueBox.style.display = 'none';
                
                if(welcomeScreen) {
                    userRealNameSpan.innerText = userData.realName;
                    welcomeScreen.style.display = 'flex';
                    setTimeout(() => welcomeScreen.classList.add('show'), 50);

                    // Переход к настройкам через 2 секунды
                    setTimeout(() => {
                        welcomeScreen.classList.remove('show');
                        setTimeout(() => {
                            welcomeScreen.style.display = 'none';
                            
                            const privacyScreen = document.getElementById('privacy-screen');
                            if (privacyScreen) {
                                privacyScreen.style.display = 'flex';
                                setTimeout(() => privacyScreen.classList.add('active'), 50);
                                
                                // Возвращаем диалог
                                if(dialogueBox) dialogueBox.style.display = 'block';
                                
                                if (taskTitle) {
                                    taskTitle.innerText = "ЗАДАЧА";
                                    taskTitle.style.color = "#8b949e";
                                }
                                startTyping("Внимательно проверь настройки приватности. Пролистай список до самого конца.");
                            }
                        }, 400); 
                    }, 2000); 
                }
            }, 1500);
        });
    }

    // 7. СОХРАНЕНИЕ НАСТРОЕК
    const btnSaveSettings = document.querySelector('.btn-save-settings');
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', () => {
            btnSaveSettings.innerText = "Сохранено!";
            btnSaveSettings.style.background = "#238636";
            
            // Здесь может быть код сохранения чекбоксов
        });
    }

});