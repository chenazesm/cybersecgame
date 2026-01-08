window.addEventListener('load', () => {
    
    const curtain = document.getElementById('curtain');
    setTimeout(() => {
        if (curtain) curtain.classList.add('fade-out');
    }, 500);

    let textToType = "";
    
    const path = window.location.pathname;

    if (path.includes('lvl1.html')) {
        textToType = "Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic!";
    }
    if (path.includes('main.html')) {
        textToType = "Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic!"; 
    }

    const textElement = document.getElementById('typewriter');
    
    if (!textElement) return;

    const typingSpeed = 30; 
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < textToType.length) {
            textElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    setTimeout(typeWriter, 1000);
});