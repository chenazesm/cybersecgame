document.addEventListener('DOMContentLoaded', () => {

    // 1. Ищем элементы
    const sidebar = document.getElementById('levelsSidebar');
    const openButton = document.getElementById('openSidebar');
    const closeButton = document.getElementById('closeSidebar');
    const gameLayout = document.getElementById('gameLayout');

    // Если на странице нет меню (например, другая страница), выходим
    if (!sidebar || !openButton || !closeButton) return;

    // --- ФУНКЦИЯ ОТКРЫТИЯ ---
    function openMenu() {
        console.log("Открываю меню...");
        sidebar.classList.add('open');           // Выезжает панель
        openButton.classList.add('hidden');      // Прячется кнопка
        if (gameLayout) {
            gameLayout.classList.add('sidebar-open'); // Сдвигается монитор
        }
    }

    // --- ФУНКЦИЯ ЗАКРЫТИЯ ---
    function closeMenu() {
        sidebar.classList.remove('open');
        openButton.classList.remove('hidden');
        if (gameLayout) {
            gameLayout.classList.remove('sidebar-open');
        }
    }

    // 2. Назначаем клики
    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);

    // 3. АВТО-ЗАПУСК через 3 сек (Только для main.html)
    const path = window.location.pathname;
    
    // Проверяем имя файла
    if (path.includes('main.html') || path.endsWith('/')) {
        setTimeout(() => {
            openMenu(); // Вызываем ту же функцию, что и при клике
        }, 3300); 
    }

    // 4. Статистика (цифры)
    const stats = {
        completed: document.getElementById('completedCount'),
        stars: document.getElementById('starsCount'),
        followers: document.getElementById('followersCount')
    };

    if (stats.completed) stats.completed.textContent = "1/10";
    if (stats.stars) stats.stars.textContent = "3/30";
    if (stats.followers) stats.followers.textContent = "12 428";
});