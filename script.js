window.addEventListener('load', () => {
    const curtain = document.getElementById('curtain');
    setTimeout(() => {
        if (curtain) curtain.classList.add('fade-out');
    }, 1000);

    const textToType = "Вася хочет стать популярным. Помоги ему зарегистрироваться в instapic!"; // ТЕКСТ 1 ДИАЛОГА
    const textElement = document.getElementById('typewriter');
    const typingSpeed = 30; 
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < textToType.length) {
            textElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        }
    }
    setTimeout(typeWriter, 1500);
});