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