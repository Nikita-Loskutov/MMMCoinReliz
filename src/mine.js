function showCopyNotification() {
    const notification = document.getElementById('copy-notification');
    notification.style.bottom = '90%';

    setTimeout(() => {
        notification.style.bottom = '150%';
    }, 1000);
}

function showCopyNotificationFalse() {
    const notification = document.getElementById('copy-notification-false');
    notification.style.bottom = '90%';

    setTimeout(() => {
        notification.style.bottom = '150%';
    }, 1000);
}

async function showUpgradeBlock(cardType) {
    const userId = document.querySelector('meta[name="user-id"]').content;
    const response = await fetch(`/get_card_data?user_id=${userId}&card_type=${cardType}`);
    if (!response.ok) {
        console.error('Error fetching card data');
        return;
    }
    const data = await response.json();

    const manualData = {
        token: { name: 'Token', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'token.png' },
        staking: { name: 'Staking', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'staking.png' },
        genesis: { name: 'Genesis', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'coin.png' },
        echeleon: { name: 'Echelon', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'coin.png' },
        ledger: { name: 'Ledger', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'coin.png' },
        quantum: { name: 'Quantum', description: 'Увеличивает колличество монет, которое вы получаете в час', image: 'coin.png' },
        multitap: { name: 'Multitap', description: 'Увеличивает колличество монет, которое вы можете получить за одно касание', image: 'click.png' }
    };

    const upgradeBlock = document.getElementById('upgrade-block');
    const upgradeTitle = upgradeBlock.querySelector('h1');
    const upgradeDescription = upgradeBlock.querySelector('.upgrade-description');
    const upgradeCost = upgradeBlock.querySelector('.upgrade-cost');
    const upgradeLevel = upgradeBlock.querySelector('.upgrade-level');
    const upgradeButton = upgradeBlock.querySelector('button.upgrade-action');
    const upgradeImage = upgradeBlock.querySelector('.upgrade-image');

    upgradeTitle.textContent = manualData[cardType].name;
    upgradeDescription.textContent = manualData[cardType].description;
    upgradeCost.textContent = `${data.cost}`;
    upgradeLevel.textContent = `● ${data.level + 1} lvl`;
    upgradeButton.setAttribute('onclick', `upgradeCard('${cardType}')`);
    upgradeImage.src = `/src/assets/${manualData[cardType].image}`;

    upgradeBlock.style.top = '50%';
}

async function upgradeCard(cardType) {
    const userId = document.querySelector('meta[name="user-id"]').content;
    const upgradeBlock = document.getElementById('upgrade-block');
    const response = await fetch('/upgrade_card', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, card_type: cardType }),
    });

    if (response.ok) {
        showCopyNotification();
        upgradeBlock.style.top = '150%';
        setTimeout(() => {
            location.reload();
        }, 1000);
        
    } else {
        showCopyNotificationFalse();
        upgradeBlock.style.top = '150%';
    }
}

document.querySelectorAll('.card button.upgrade').forEach(button => {
    button.addEventListener('click', (event) => {
        const cardType = event.target.getAttribute('data-card-type');
        showUpgradeBlock(cardType);
    });
});

document.querySelectorAll('.multitap button.upgrade').forEach(button => {
    button.addEventListener('click', (event) => {
        const cardType = event.target.getAttribute('data-card-type');
        showUpgradeBlock(cardType);
    });
});

document.getElementById('exit').addEventListener('click', function(){
    const upgradeBlock = document.getElementById('upgrade-block');
    upgradeBlock.style.top = '150%';
});