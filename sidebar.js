document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('levelsSidebar');
    const openButton = document.getElementById('openSidebar');
    const closeButton = document.getElementById('closeSidebar');
    const gameLayout = document.getElementById('gameLayout');

    if (!sidebar || !openButton || !closeButton) return;

    function openMenu() {
        sidebar.classList.add('open');
        openButton.classList.add('hidden');
        if (gameLayout) gameLayout.classList.add('sidebar-open');
    }

    function closeMenu() {
        sidebar.classList.remove('open');
        openButton.classList.remove('hidden');
        if (gameLayout) gameLayout.classList.remove('sidebar-open');
    }

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);

    // Авто-открытие только на главной
    if (window.location.pathname.includes('main.html')) {
        setTimeout(openMenu, 3300);
    }
});



//LS

function unlockLevels() {

    let progress = getProgress();
    const levels = document.querySelectorAll(".level-item");

    levels.forEach((levelBtn, index) => {

        let levelNumber = index + 1;

        if (
            levelNumber === 1 ||
            progress.completedLevels.includes(levelNumber - 1)
        ) {

            levelBtn.classList.remove("locked");
            levelBtn.classList.add("active");

            levelBtn.onclick = function () {
                window.location.href = `lvl${levelNumber}.html`;
            };

        } else {
            levelBtn.classList.add("locked");
            levelBtn.onclick = null;
        }

    });
}

function updateDifficultyStyles() {

    const levels = document.querySelectorAll(".level-item");

    levels.forEach(level => {

        const difficulty = level.querySelector(".level-difficulty");
        if (!difficulty) return;

        if (level.classList.contains("active")) {
            difficulty.classList.remove("hard", "medium");
            difficulty.classList.add("easy");
        }

    });
}
