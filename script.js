
let typingTimer = null;
const textElement = document.getElementById('typewriter');

function startTyping(text, onComplete = null) {
    if (!textElement) return;
    
    if (typingTimer) {
        clearTimeout(typingTimer);
        typingTimer = null;
    }
    
    textElement.innerHTML = "";
    
    let charIndex = 0;
    const typingSpeed = 30;

    function typeLoop() {
        if (charIndex < text.length) {
            textElement.innerHTML += text.charAt(charIndex);
            charIndex++;
            typingTimer = setTimeout(typeLoop, typingSpeed);
        } else {
            typingTimer = null;
            if (onComplete) {
                onComplete();
            }
        }
    }
    
    setTimeout(typeLoop, 50);
}

window.addEventListener('load', () => {
    const curtain = document.getElementById('curtain');
    if (curtain) {
        setTimeout(() => {
            curtain.classList.add('fade-out');
        }, 500);
    }

    const path = window.location.pathname;
    
    if (path.includes('main.html') || path.includes('index.html') || path.endsWith('/')) {
        setTimeout(() => {
            startTyping("Привет мир. Выбери задачу в меню справа."); 
        }, 1000);
    }
});