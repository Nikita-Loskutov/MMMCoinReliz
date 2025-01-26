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

    async function updateCoinsOnServer() {
        try {
            console.log('Updating coins on server with:', { user_id: userId, coins: score });
            const response = await fetch('/update_coins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-ID': userId // Ensure the header matches the backend
                },
                body: JSON.stringify({ coins: score })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error('Error updating coins:', data.error || 'Unknown error');
            } else {
                console.log('Coins updated successfully:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    hamster.addEventListener('click', (event) => {
        const rect = hamster.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        const DEG = 40;
        const tiltX = (offsetY / rect.height) * DEG;
        const tiltY = (offsetX / rect.width) * -DEG;

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
