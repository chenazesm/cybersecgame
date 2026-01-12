const sidebar = document.getElementById('levelsSidebar');
const openButton = document.getElementById('openSidebar');
const closeButton = document.getElementById('closeSidebar');

openButton.addEventListener('click', () => {
    sidebar.classList.add('open');
    openButton.classList.add('hidden');
});

closeButton.addEventListener('click', () => {
    sidebar.classList.remove('open');
    openButton.classList.remove('hidden');
});

// отъезжание сцены

const gameLayout = document.getElementById('gameLayout');

openButton.addEventListener('click', () => {
    sidebar.classList.add('open');
    gameLayout.classList.add('sidebar-open');
});

closeButton.addEventListener('click', () => {
    sidebar.classList.remove('open');
    gameLayout.classList.remove('sidebar-open');
});



function updateStatsPanel() {
    document.getElementById('completedCount').textContent =
        `${gameProgress.completedLevels}/${gameProgress.totalLevels}`;

    document.getElementById('starsCount').textContent =
        `${gameProgress.stars}/${gameProgress.maxStars}`;

    document.getElementById('followersCount').textContent =
        gameProgress.followers.toLocaleString('ru-RU');
}

function completeLevel(starsEarned, newFollowers) {
    gameProgress.completedLevels++;
    gameProgress.stars += starsEarned;
    gameProgress.followers += newFollowers;

    updateStatsPanel();
}

completeLevel(1, 10);


