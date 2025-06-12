async function copyReferralLink() {
    const userId = document.querySelector('meta[name="user-id"]').content;
    const referralLink = `https://a3da-2a0d-5600-44-9000-00-24c4.ngrok-free.app/invite?referrer_id=${userId}`;

    try {
        await navigator.clipboard.writeText(referralLink);
        showCopyNotification();
    } catch (err) {
        console.error('Failed to copy referral link: ', err);
    }
}

function showCopyNotification() {
    const notification = document.getElementById('copy-notification');
    notification.style.bottom = '90%';

    setTimeout(() => {
        notification.style.bottom = '150%';
    }, 2000);
}
// fix after
function shareReferralLink() {
    const userId = document.querySelector('meta[name="user-id"]').content;
    const referralLink = `https://a3da-2a0d-5600-44-9000-00-24c4.ngrok-free.app/invite?referrer_id=${userId}`;
    const message = `🎉 Привет! Я приглашаю тебя в MMM Coin. Получи бонусы и начни зарабатывать! 💰\n\n👉 Присоединяйся\n5000 монет в качестве подарка\n25000 монет, если у тебя есть Telegram Premium`;

    if (typeof Telegram !== "undefined" && Telegram.WebApp) {
        console.log("✅ Telegram WebApp API доступен!");
        Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`);
    } else if (navigator.userAgent.includes("Telegram")) {
        console.log("🔹 Работаем в Telegram WebView, но API недоступен. Пробуем обычную ссылку...");
        window.location.href = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
    } else if (navigator.share) {
        console.log("🌍 Используем Web Share API");
        navigator.share({
            title: "Приглашение в MMM Coin",
            text: message,
            url: referralLink
        }).catch(err => console.error("Ошибка при отправке ссылки:", err));
    } else {
        console.warn("❌ Telegram WebApp не поддерживается. Запасной вариант...");
        alert("Telegram WebApp не поддерживается. Отправьте ссылку вручную.");
    }
}




// Функция для отображения рефералов
async function displayReferrals() {
    const userId = document.querySelector('meta[name="user-id"]').content;
    const referralsContainer = document.getElementById("referrals-list");
    const invitedFriendsCountElement = document.getElementById("invited-friends-count");

    try {
        const response = await fetch(`/invited_friends?user_id=${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
            const referrals = data.referrals;
            referralsContainer.innerHTML = ''; // Очистить контейнер перед добавлением новых элементов
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

            invitedFriendsCountElement.innerText = referrals.length; // Обновить количество приглашенных друзей
        } else {
            console.error('Failed to load referrals:', data.error);
        }
    } catch (error) {
        console.error('Error fetching referrals:', error);
    }
}

// Вызываем функцию для отображения рефералов
displayReferrals();