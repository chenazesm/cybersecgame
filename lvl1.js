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
        
        // --- !!! ВАЖНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ !!! ---
        // Если это поле пароля - пропускаем хакерскую логику
        if (input.id === 'reg-pass') return; 
        // -------------------------------------

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


    // 6. КНОПКА РЕГИСТРАЦИИ 
    const btnRegister = document.getElementById('btn-register');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userRealNameSpan = document.getElementById('user-real-name');
    
    // Восстанавливаем переменные, чтобы код ниже работал
    const inputPhone = document.getElementById('reg-phone');
    const inputName = document.getElementById('reg-name');
    const inputUser = document.getElementById('reg-username');
    const inputPass = document.getElementById('reg-pass'); // Тот самый пароль

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            // Проверка на пустоту
            if (!inputPhone.value || !inputName.value || !inputUser.value || !inputPass.value) {
                alert("Заполните все поля!"); 
                return;
            }

            // Сохранение (сохраняем всё, включая пароль, который ввел пользователь)
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
                if(registerView) registerView.style.display = 'none';
                const visuals = document.querySelector('.visuals');
                if(visuals) visuals.style.display = 'none';
                
                if(welcomeScreen) {
                    userRealNameSpan.innerText = userData.realName;
                    welcomeScreen.style.display = 'flex';
                    setTimeout(() => welcomeScreen.classList.add('show'), 50);

                    // Переход к настройкам
                    setTimeout(() => {
                        welcomeScreen.classList.remove('show');
                        setTimeout(() => {
                            welcomeScreen.style.display = 'none';
                            
                            const privacyScreen = document.getElementById('privacy-screen');
                            if (privacyScreen) {
                                privacyScreen.style.display = 'flex';
                                setTimeout(() => privacyScreen.classList.add('active'), 50);
                                
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
            
            // Логика сохранения чекбоксов (можно добавить позже)
        });
    }

});