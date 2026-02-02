document.addEventListener('DOMContentLoaded', () => {

    const box = document.querySelector('.dialogue-box');
    box.classList.add('visible');
    box.style.bottom = '1%';
    // box.style.zIndex = '90000000';
    const dialogueBox = document.querySelector('.dialogue-box');
    if (dialogueBox) {
        dialogueBox.style.display = 'block'; // Убеждаемся, что блок есть
        // Небольшая задержка, чтобы сработала CSS анимация
        setTimeout(() => {
            dialogueBox.classList.add('visible'); // Делаем непрозрачным (opacity: 1)
        }, 100);
    }

    // --- 2. Старт текста ---
    if (typeof startTyping === 'function') {
        startTyping("Твой видеоредактор сломался. Друг предлагает помощь. Посмотрим, что он прислал.");
    }

    const messagesArea = document.getElementById('messagesArea');
    const installerOverlay = document.getElementById('installerOverlay');
    const progressBar = document.getElementById('progressBar');
    const installStatus = document.getElementById('installStatus');
    
    // --- ЧАТ ---
    setTimeout(() => {
        addMessage("блин, премьер опять крашится на рендере. а у меня проект горит", "message-bubble message-received", "right");
    }, 1000);

    setTimeout(() => {
        addMessage("не парься. у меня есть кряк рабочий. сам использую полгода. ", "message-bubble message-received", "left");
        
        setTimeout(() => {
            addFileMessage();
            if (typeof startTyping === 'function') {
                startTyping("Саша прислал файл. Выглядит как обычный установщик. Нужно установить, чтобы доделать проект.");
            }
        }, 1500);
    }, 3000);

    function addMessage(text, className, align) {
        const bubble = document.createElement('div');
        bubble.className = className;
        bubble.style.alignSelf = align === "right" ? "flex-end" : "flex-start";
        bubble.style.backgroundColor = align === "right" ? "#3797f0" : "#262626";
        bubble.innerText = text;
        messagesArea.appendChild(bubble);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function addFileMessage() {
        const bubble = document.createElement('div');
        bubble.className = "message-bubble message-received";
        bubble.style.padding = "5px";
        bubble.innerHTML = `
            <div class="file-attachment" id="downloadFileBtn">
                <div class="file-icon">💾</div>
                <div class="file-info">
                    <span class="filename">VideoRed_Setup.exe</span>
                    <span class="filesize">45.2 MB</span>
                </div>
            </div>
        `;
        messagesArea.appendChild(bubble);
        messagesArea.scrollTop = messagesArea.scrollHeight;

        document.getElementById('downloadFileBtn').addEventListener('click', openInstaller);
    }

    // --- УСТАНОВКА (ИГРА) ---
    let installInterval;
    let isTrapActive = false;

    function openInstaller() {
        installerOverlay.style.display = 'flex';
        
        // Убеждаемся, что диалог виден поверх затемнения
        if (dialogueBox) {
            dialogueBox.style.display = 'block';
            dialogueBox.classList.add('visible');
            dialogueBox.style.zIndex = "2500"; 
        }
        

        let progress = 0;
        const steps = [
            { p: 10, text: "Распаковка архивов..." },
            { p: 20, text: "Копирование библиотек..." },
            { p: 30, text: "Установка VideoRed.config..." },
            { p: 44, text: "Установка VideoRed_data..." },
            { p: 52, text: "Установка VideoRed.exe..." },
            { p: 60, text: "Установка VideoRed.bat..." },
            { p: 70, text: "Установка CryptoMiner.exe...", trap: true }, // ЛОВУШКА
            { p: 85, text: "Создание ярлыков..." },
            { p: 90, text: "Завершение..." },
            { p: 100, text: "Готово" }
        ];

        let stepIndex = 0;

        installInterval = setInterval(() => {
            progress += 1; 
            progressBar.style.width = progress + "%";

            if (stepIndex < steps.length && progress >= steps[stepIndex].p) {
                const currentStep = steps[stepIndex];
                installStatus.innerText = currentStep.text;
                
                if (currentStep.trap) {
                    isTrapActive = true;
                    installStatus.classList.add("danger-text");
                    clearInterval(installInterval);
                    installInterval = setInterval(() => {
                        progress += 0.5; 
                        progressBar.style.width = progress + "%";
                        if (progress >= 99) {
                            gameOver();
                        }
                    }, 50);
                } else {
                    installStatus.classList.remove("danger-text");
                    isTrapActive = false;
                }
                stepIndex++;
            }

            if (progress >= 100) {
                clearInterval(installInterval);
            }
        }, 50); 
    }

    // КНОПКА ОТМЕНА
    document.getElementById('cancelInstallBtn').addEventListener('click', () => {
        clearInterval(installInterval);
        installerOverlay.style.display = 'none';

        if (dialogueBox) {
            dialogueBox.classList.add('visible');
            dialogueBox.style.zIndex = "2000";
        }

        if (isTrapActive) {
            // ПОБЕДА
            const typewriter = document.getElementById('typewriter');

            startTyping("Отлично! Ты заметил скрытый майнер. Всегда читай, что устанавливаешь, даже если файл от друга.", () => {
                 setTimeout(() => alert("Уровень пройден!"), 1000);
            });
            
        } else {
            // Нейтрально
            startTyping("Ты отменил установку. Лучше перестраховаться.");
        }
    });

    function gameOver() {
        // Останавливаем установку и скрываем окно
        clearInterval(installInterval);
        installerOverlay.style.display = 'none';
        
        // Делаем текст в диалоге красным
        const typewriter = document.getElementById('typewriter');
        
        // Пишем объяснение ошибки
        startTyping("Ты пропустил установку скрытого файла CryptoMiner.exe. Твой компьютер начинает тормозить...", () => {
            
            // --- ЭТОТ КОД ЗАПУСТИТСЯ ПОСЛЕ ПЕЧАТИ ТЕКСТА ---
            const curtain = document.getElementById('curtain');
            
            if (curtain) {
                curtain.innerHTML = '<div class="game-over-text">Неудачная попытка.<br>Попробуйте еще раз</div>';
                
                curtain.classList.remove('fade-out');
                
                setTimeout(() => {
                    const goText = curtain.querySelector('.game-over-text');
                    if(goText) goText.style.opacity = '1';
                }, 100);

                setTimeout(() => {
                    location.reload();
                }, 3000);
            }
        });
    }
});