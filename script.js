window.addEventListener('load', () => {
    
    // --- 1. ШТОРКА ---
    const curtain = document.getElementById('curtain');
    setTimeout(() => {
        if (curtain) curtain.classList.add('fade-out');
    }, 500);


// "печатная машинка"
    let typingTimer = null;
    const textElement = document.getElementById('typewriter');

    function startTyping(text) {
        if (!textElement) return;
        if (typingTimer) clearTimeout(typingTimer);
        textElement.innerHTML = "";
        
        let charIndex = 0;
        const typingSpeed = 30;

        function typeLoop() {
            if (charIndex < text.length) {
                textElement.innerHTML += text.charAt(charIndex);
                charIndex++;
                typingTimer = setTimeout(typeLoop, typingSpeed);
            }
        }
        typeLoop();
    }


// запуск текста
    let initialText = "";
    const path = window.location.pathname;

    if (path.includes('lvl1.html') || path.includes('level1.html')) {
        initialText = "Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic.";
    } else if (path.includes('main.html')) {
        initialText = "Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic!"; 
    } else {
        initialText = "Привет мир";
    }

    setTimeout(() => {
        startTyping(initialText);
    }, 1000);


// ошибка
    const errorMsg = document.getElementById('error-msg');
    let errorTimeout;

    function showError(text) {
        if(errorMsg) {
            errorMsg.innerText = text; 
            errorMsg.classList.add('visible');
            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                errorMsg.classList.remove('visible');
            }, 2000);
        }
    }

    const loginInputs = document.querySelectorAll('.login-form input'); 
    loginInputs.forEach(input => {
        input.addEventListener('input', () => {
            if(document.getElementById('login-view').style.display !== 'none') {
                 showError("Сначала нужно зарегистрироваться!");
            }
        });
    });


// к регистрации
    const regLink = document.getElementById('reg-link');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');

    if (regLink) {
        regLink.addEventListener('click', (e) => {
            e.preventDefault();
            regLink.innerHTML = '<span class="mac-spinner"></span>';
            regLink.style.pointerEvents = 'none';
            const randomDelay = Math.floor(Math.random() * 400) + 100;

            setTimeout(() => {
                if(loginView) loginView.style.display = 'none';
                if(registerView) registerView.style.display = 'block';
                startTyping("Отлично. Теперь заполни свою информацию.");
            }, randomDelay);
        });
    }

// логика регистрации 
    const btnRegister = document.getElementById('btn-register');
    const welcomeScreen = document.getElementById('welcome-screen');
    const userRealNameSpan = document.getElementById('user-real-name');
    
    const inputPhone = document.getElementById('reg-phone');
    const inputName = document.getElementById('reg-name');
    const inputUser = document.getElementById('reg-username');
    const inputPass = document.getElementById('reg-pass');

    if (btnRegister) {
        btnRegister.addEventListener('click', () => {
            if (inputPhone.value === "" || inputName.value === "" || inputUser.value === "" || inputPass.value === "") {
                showError("Заполните все поля!");
                return;
            }

            const userData = {
                phone: inputPhone.value,
                realName: inputName.value,
                username: inputUser.value,
                password: inputPass.value
            };

            localStorage.setItem('gameUserData', JSON.stringify(userData));
            
            console.log("Данные сохранены:", userData);

            if(registerView) registerView.style.display = 'none';
            
            const dialogueBox = document.querySelector('.dialogue-box');
            if(dialogueBox) dialogueBox.style.display = 'none';
            
            const instaVisuals = document.querySelector('.visuals');
            if(instaVisuals) instaVisuals.style.display = 'none';
            if(welcomeScreen) {
                userRealNameSpan.innerText = userData.realName;
                welcomeScreen.style.display = 'flex';
                setTimeout(() => { welcomeScreen.classList.add('show'); }, 50);

                setTimeout(() => {
                    welcomeScreen.classList.remove('show');
                    setTimeout(() => {
                        welcomeScreen.style.display = 'none';
                        
                        const privacyScreen = document.getElementById('privacy-screen');
                        if (privacyScreen) {
                            privacyScreen.style.display = 'flex';
                            setTimeout(() => {
                                privacyScreen.classList.add('active');
                            }, 50);

                            startTyping("Внимательно проверь настройки приватности. Пролистай список до самого конца.");
                        }
                    }, 400); // пока исчезнет "здравствуйте"
                }, 800); // вис "здравствуйте"
            }
        });
    }
});