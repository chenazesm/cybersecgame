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
        const dialogueBox = document.querySelector('.dialogue-box');
        if (dialogueBox) dialogueBox.classList.add('visible');
        
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
        toast.style.display = 'flex'; 
        toast.innerHTML = `<strong>oleg710</strong><br><small>У вас новое сообщение!</small>`;
        
        toast.onclick = () => {
            toast.remove();
            const dialogueBox = document.querySelector('.dialogue-box');
            if (dialogueBox) dialogueBox.classList.remove('visible');

            const chat = document.getElementById('chatOverlay');
            if (chat) {
                chat.style.display = 'flex';
                setTimeout(() => chat.classList.add('open'), 10);
            }
        };
        container.appendChild(toast);
    }, 5500);

    const scamLink = document.getElementById('scamLink');
    if (scamLink) {
        scamLink.onclick = (e) => {
            e.preventDefault();
            const securityBanner = document.getElementById('securityBanner');
            if (securityBanner) {
                securityBanner.style.display = 'block';
                const dialogueBox = document.querySelector('.dialogue-box');
                if (dialogueBox) dialogueBox.classList.add('visible');
            }
        };
    }
});

function blockChat() {
    closeDM();
    const dialogueBox = document.querySelector('.dialogue-box');
    if (dialogueBox) dialogueBox.classList.add('visible');
    const typewriter = document.getElementById('typewriter');
    if(typewriter) typewriter.style.color = "#ffffff"; 

    if (typeof startTyping === 'function') {
        startTyping("Ты правильно отреагировал. Если приходит сообщение от незнакомцев, следует сразу блокировать контакт.");
    }
}

function ignoreChat() {
    blockChat();
}

const targetMsg = "окей, я согласен";
let currentTypeIndex = 0;
const fakeInput = document.getElementById('fakeInput');
const inputText = document.getElementById('inputText');
const directModal = document.getElementById('directModal');
const paymentModal = document.getElementById('paymentModal');
const paymentStatus = document.getElementById('paymentStatus');
const messagesContainer = document.getElementById('messagesContainer');
const chatFooter = document.getElementById('chatFooter');

if (fakeInput) {
    fakeInput.addEventListener('keydown', (e) => {
        if (document.activeElement !== fakeInput) return;
        e.preventDefault();
        if (currentTypeIndex < targetMsg.length) {
            if (currentTypeIndex === 0) {
                inputText.classList.remove('shimmer-text');
                inputText.innerHTML = "";
                inputText.style.color = "white";
            }
            inputText.innerHTML += targetMsg[currentTypeIndex];
            currentTypeIndex++;
            if (currentTypeIndex === targetMsg.length) {
                setTimeout(startPaymentSequence, 500);
            }
        }
    });
}

function startPaymentSequence() {
    const directModal = document.getElementById('directModal');
    const paymentModal = document.getElementById('paymentModal');
    const paymentStatus = document.getElementById('paymentStatus');
    const dialogueBox = document.querySelector('.dialogue-box');

    if (directModal) directModal.classList.add('blur-filter');
    if (paymentModal) paymentModal.style.display = 'block';

    setTimeout(() => {
        if (paymentStatus) paymentStatus.innerHTML = "Платёж успешно выполнен!<br><span style='color:#ff5f56; font-weight:bold;'>-50 BYN</span>";
        const icon = document.querySelector('.payment-icon');
        if (icon) icon.innerHTML = "✅";
        
        setTimeout(() => {
            if (paymentModal) paymentModal.style.display = 'none';
            if (directModal) directModal.classList.remove('blur-filter');
            
            const userMsg = document.createElement('div');
            userMsg.className = "message-bubble";
            userMsg.style.cssText = "align-self: flex-end; background-color: #0095f6; color: white; border-bottom-right-radius: 4px; border-bottom-left-radius: 22px;";
            userMsg.innerHTML = targetMsg;
            if (messagesContainer) {
                messagesContainer.appendChild(userMsg);
                messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
            }

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = "message-bubble message-received";
                botMsg.innerHTML = "неплохо, спасибо";
                if (messagesContainer) {
                    messagesContainer.appendChild(botMsg);
                    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
                }

                setTimeout(() => {
                    if (chatFooter) chatFooter.innerHTML = '<div class="restricted-notice">Пользователь ограничил отправку сообщений</div>';
                    
                    setTimeout(() => {
                        if (dialogueBox) {
                            dialogueBox.classList.add('visible');
                            const taskTitle = dialogueBox.querySelector('.task-title');
                            if (taskTitle) {
                                taskTitle.innerText = "ПОЯСНЕНИЕ";
                                taskTitle.style.color = "#8b949e";
                            }
                            const finalExplanation = "Это типичная схема мошенничества. Настоящие сервисы банков всегда берут комиссию ИЗ суммы перевода, а не просят оплатить ее отдельно.";
                            if (typeof startTyping === "function") {
                                startTyping(finalExplanation, () => {
                                    setTimeout(() => {
                                        const curtain = document.getElementById('curtain');
                                        if (curtain) {
                                            curtain.innerHTML = '<div class="game-over-text">Неудачная попытка.<br>Попробуйте еще раз</div>';
                                            curtain.classList.remove('fade-out');
                                            setTimeout(() => {
                                                const goText = curtain.querySelector('.game-over-text');
                                                if(goText) goText.style.opacity = '1';
                                            }, 100);
                                            setTimeout(() => location.reload(), 4000);
                                        }
                                    }, 1500);
                                });
                            }
                        }
                    }, 2000);
                }, 300);
            }, 1000);
        }, 1500);
    }, 1500);
}