const newPostBtn = document.getElementById('newPostBtn');
const postOverlay = document.getElementById('postOverlay');
const closePost = document.getElementById('closePost');

newPostBtn.addEventListener('click', () => {
    postOverlay.classList.add('open');
});

closePost.addEventListener('click', () => {
    postOverlay.classList.remove('open');
});

// закрытие по клику вне модалки
postOverlay.addEventListener('click', (e) => {
    if (e.target === postOverlay) {
        postOverlay.classList.remove('open');
    }
});
