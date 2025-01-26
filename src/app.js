document.addEventListener('DOMContentLoaded', () => {
    const hamster = document.getElementById('hamster');
    const scoreElement = document.getElementById('score');
    const progressBar = document.querySelector('.level-progress');
    let score = parseInt(scoreElement.innerText);
    const userId = document.querySelector('meta[name="user-id"]').content;

    function updateProgressBar() {
        const percentage = (score / 5000) * 100;
        progressBar.style.width = `${Math.min(percentage, 100)}%`;
    }

    function updateCoinsOnServer() {
        fetch('/update_coins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, coins: score })
        });
    }

    function updateProfitPerHourOnServer(profit) {
        fetch('/update_profit_per_hour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, profit_per_hour: profit })
        });
    }

    hamster.addEventListener('click', (event) => {
        const rect = hamster.getBoundingClientRect();
        const offfsetX = event.clientX - rect.left - rect.width / 2;
        const offfsetY = event.clientY - rect.top - rect.height / 2;
        const DEG = 40;
        const tiltX = (offfsetY / rect.height) * DEG;
        const tiltY = (offfsetX / rect.width) * -DEG;

        hamster.style.setProperty('--tiltX', `${tiltX}deg`);
        hamster.style.setProperty('--tiltY', `${tiltY}deg`);

        setTimeout(() => {
            hamster.style.setProperty('--tiltX', `0deg`);
            hamster.style.setProperty('--tiltY', `0deg`);
        }, 300);

        score += 1;
        scoreElement.innerText = score;
        updateProgressBar();
        updateCoinsOnServer();

        const plusOne = document.createElement('div');
        plusOne.className = 'floating-plus-one';
        plusOne.innerText = '+1';

        plusOne.style.left = `${event.clientX}px`;
        plusOne.style.top = `${event.clientY}px`;

        document.body.appendChild(plusOne);

        setTimeout(() => {
            document.body.removeChild(plusOne);
        }, 1000);
    });

    updateProgressBar();
});