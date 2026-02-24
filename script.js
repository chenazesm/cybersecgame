
let typingTimer = null;
const textElement = document.getElementById('typewriter');
const followersByLevel = {
    1: 0,
    2: 125,
    3: 1250,
    4: 1500,
    5: 3432,
    6: 8000,
    7: 20000,
    8: 75000,
    9: 250000,
    10: 1200000
};

// gameProgress = {
//   completedLevels: [1,2,3], // массив пройденных
//   totalStars: 9
// }

// ===== ИНИЦИАЛИЗАЦИЯ =====

function getProgress() {
    const data = localStorage.getItem("gameProgress");
    return data ? JSON.parse(data) : { completedLevels: [], totalStars: 0 };
}

function saveProgress(progress) {
    localStorage.setItem("gameProgress", JSON.stringify(progress));
}

function completeLevel(levelNumber) {

    let progress = getProgress();

    // Если уровень ещё не был пройден
    if (!progress.completedLevels.includes(levelNumber)) {

        progress.completedLevels.push(levelNumber);
        progress.totalStars += 3;

        saveProgress(progress);
    }
}

function updateStats() {

    let progress = getProgress();

    document.getElementById("completedCount").innerText =
        progress.completedLevels.length + "/10";

    document.getElementById("starsCount").innerText =
        progress.totalStars + "/30";

    
}

function setFollowers(count) {
    localStorage.setItem("followers", count);
}

function getFollowers() {
    return localStorage.getItem("followers") || 0;
}

function updateFollowersUI() {
    const el = document.getElementById("followersCount");
    if (el) {
        el.textContent = formatFollowers(getFollowers());
    }
}

function formatFollowers(num) {
    num = Number(num);

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }

    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }

    return num;
}


window.addEventListener("DOMContentLoaded", function() {
    updateStats();
    unlockLevels();
    updateDifficultyStyles();
    updateFollowersUI();
});

document.addEventListener("DOMContentLoaded", function() {

    const resetBtn = document.getElementById("resetProfile");

    if (resetBtn) {
        resetBtn.addEventListener("click", function() {

            const confirmReset = confirm("Сбросить весь прогресс?");

            if (confirmReset) {

                // Очищаем ВСЁ
                localStorage.removeItem("completedLevels");
                localStorage.removeItem("stars");
                localStorage.removeItem("followers");

                 localStorage.clear();

                
                location.reload();
                location.href='main.html'
            }
        });
    }

});











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
            startTyping("В этой игре вам предстоит познакомиться с основными видами интернет-угроз, научиться распознавать их проявления и принимать безопасные решения. Выберите первый уровень в меню справа, чтобы начать"); 
        }, 1000);
    }
});

function goToLevel(url) {
    const curtain = document.getElementById('curtain');
    if (curtain) {
        curtain.classList.remove('fade-out');
    }

    setTimeout(() => {
        window.location.href = url;
    }, 400);
}