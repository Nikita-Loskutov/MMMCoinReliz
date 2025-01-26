// Пример данных о рефералах
const referrals = [
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},
    { name: "Иван Иванов"},


];

// Функция для отображения рефералов
function displayReferrals() {
    const referralsContainer = document.getElementById("referrals-list");
    referrals.forEach(referral => {
        // Создаем блок для каждого реферала
        const referralBlock = document.createElement("div");
        referralBlock.className = "refblock";
        referralBlock.innerHTML = `
            <img src="assets/user.png">
            <h3>${referral.name}</h3>
        `;
        referralsContainer.appendChild(referralBlock);
    });
}

// Вызываем функцию для отображения рефералов
displayReferrals();
