//document.addEventListener("DOMContentLoaded", () => {
//    // Инициализация WebApp
//    const tg = Telegram.WebApp;
//
//    // Получение данных пользователя
//    const userData = tg.initDataUnsafe?.user;
//
//    // Проверяем наличие данных пользователя
//    if (userData && userData.username) {
//        const usernameElement = document.getElementById('username');
//        if (usernameElement) {
//            // Обновляем содержимое элемента 'username'
//            usernameElement.textContent = `@${userData.username}`;
//            console.log(`Username обновлен: @${userData.username}`);
//        } else {
//            console.error("Элемент с ID 'username' не найден в HTML.");
//        }
//    } else {
//        console.error("Данные пользователя отсутствуют или username не указан.");
//    }
//
//    // Расширяем приложение (опционально)
//
//});

document.addEventListener('DOMContentLoaded', () => {
    let tg = window.Telegram.WebApp;
    let name = tg.initDataUnsafe.user?.username || 'Guest';
    let usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = `@${name}`;
    } else {
        console.error('Element with id "username" not found.');
    }
});
