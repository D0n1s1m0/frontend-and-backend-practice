// Функция для переключения темы
function toggleTheme() {
    const body = document.body;
    const themeSwitcher = document.getElementById('themeSwitcher');
    
    if (body.classList.contains('theme-light')) {
        // Переключаем на темную тему
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        localStorage.setItem('theme', 'dark');
        themeSwitcher.setAttribute('aria-label', 'Переключить на светлую тему');
    } else {
        // Переключаем на светлую тему
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        localStorage.setItem('theme', 'light');
        themeSwitcher.setAttribute('aria-label', 'Переключить на темную тему');
    }
}

// Функция для загрузки сохраненной темы
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeSwitcher = document.getElementById('themeSwitcher');
    
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${savedTheme}`);
    
    if (savedTheme === 'light') {
        themeSwitcher.setAttribute('aria-label', 'Переключить на темную тему');
    } else {
        themeSwitcher.setAttribute('aria-label', 'Переключить на светлую тему');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненную тему
    loadTheme();
    
    // Добавляем обработчик для переключателя темы
    const themeSwitcher = document.getElementById('themeSwitcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', toggleTheme);
    }
});
