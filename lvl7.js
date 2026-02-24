document.addEventListener('DOMContentLoaded', () => {
    const curtain = document.getElementById('curtain');
    if (curtain) {
        curtain.style.transition = "opacity 0.1s";
        setTimeout(() => {
            curtain.classList.add('fade-out');
        }, 100);
    }
    setTimeout(() => {
        if (typeof startTyping === 'function') {
            startTyping("Ты в прямом эфире! Общайся с подписчиками и следи за донатами.");
        }
    }, 500);

    const chatArea = document.getElementById('streamChat');
    const nicknames = ["nagibator2000", "Kate_Smile", "ProGamer", "Alex", "Masha", "Ivan_Ivanov", "CyberNinja", "CatLover", "sashapro", "fdkfdfkdfjdk", "dream", "mineproplayer", "super666", "shadow303", "steve233", "alex399", "herobrine"];
    const colors = ["u-red", "u-blue", "u-green", "u-yellow", "u-purple"];
    const phrases = [
        "привет!", "привееет", "КУ", "ку", "как дела", "го в пати", "ламповый стрим", 
        "заметь меня!", "когда новое видео?", "xd", "gggggggggggggg", "скилл",
        "где актив?", "модеры тут?", "подпишись пж", "красава", "+rep", "пжжпжпжжпжж", "топ", "имба"
    ];

    function addChatMessage() {
        if (!chatArea) return;

        const div = document.createElement('div');
        div.className = "chat-msg";
        
        const randomNick = nicknames[Math.floor(Math.random() * nicknames.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomText = phrases[Math.floor(Math.random() * phrases.length)];

        div.innerHTML = `<span class="chat-user ${randomColor}">${randomNick}:</span> <span class="chat-text">${randomText}</span>`;
        
        chatArea.appendChild(div);
    
        if (chatArea.children.length > 50) {
            chatArea.removeChild(chatArea.children[0]);
        }
    }

    
    let chatSpeed = 1500; 
    let chatTimer;

    function chatLoop() {
        addChatMessage();
        
        chatTimer = setTimeout(chatLoop, chatSpeed);
    }

    chatLoop();

    setTimeout(() => {
        chatSpeed = 600;
    }, 3000);

    setTimeout(() => {
        chatSpeed = 150;
    }, 6000);

});

    // ВСТАВИТЬ ПРИ WIN СРАЗУ ПЕРЕД ПЕРЕХОДОМ НА НОВЫЙ УРОВЕНЬ
    // completeLevel(7);       
    // setFollowers(followersByLevel[7]);
    // updateFollowersUI();
    // updateStats();