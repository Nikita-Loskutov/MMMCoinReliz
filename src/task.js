const USER_ID = document.querySelector('meta[name="user-id"]').content;


const taskBlock = document.getElementById('earn_block');
const subBlock = document.getElementById('sub_block');

const upgradeTitle = subBlock.querySelector('h1');
const upgradeDescription = subBlock.querySelector('.upgrade-description');
const upgradeCost = document.getElementById('upgrade-cost');
const upgradeButton = subBlock.querySelector('.upgrade-action');

document.getElementById('daytask').addEventListener("click", function () {
    showTaskblock();
});

document.getElementById('task-overlay').addEventListener('click', function () {
    taskBlock.style.top = '150%';
    document.getElementById('task-overlay').classList.remove('active');
    document.body.style.overflow = '';
});
document.querySelectorAll('.task-overlay').forEach(exit => {
    exit.addEventListener('click', function () {
        subBlock.style.top = '150%';
        document.getElementById('task-overlay').classList.remove('active');
        document.body.style.overflow = '';
    });
});


document.getElementById('tg').addEventListener('click', function () {
    showSubblock("Телеграм", "Подпишись на наш канал в Telegram и получи", 5000, "https://t.me/yourchannel", "tg", USER_ID);
});


document.getElementById('x').addEventListener('click', function () {
    showSubblock("X (Twitter)", "Подпишись на наш аккаунт в X и получи", 5000, "https://x.com/yourprofile", "x", USER_ID);
});
document.getElementById('inst').addEventListener('click', function () {
    showSubblock("Инстаграм", "Подпишись на наш Instagram и получи", 5000, "https://instagram.com/yourprofile", "inst", USER_ID);
});
document.getElementById('yt').addEventListener('click', function () {
    showSubblock("YouTube", "Подпишись на наш YouTube канал и получи", 5000, "https://www.youtube.com/@TheKotBegemotWorld", "yt", USER_ID);
});
document.getElementById('part').addEventListener('click', function () {
    showSubblock("Партнёр", "Подпишись на партнёра и получи", 5000, "https://partner-link.com", "part", USER_ID);
});

function showTaskblock() {
    taskBlock.style.top = '40%';
    document.getElementById('task-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSubblock(title, description, reward, link, taskKey, userId) {
    const upgradeTitle = document.querySelector("#sub_block h1");
    const upgradeDesc = document.querySelector(".upgrade-description");
    const upgradeCost = document.getElementById("upgrade-cost");
    const upgradeButton = document.querySelector(".upgrade-action");

    upgradeTitle.textContent = title;
    upgradeDesc.textContent = `${description} ${reward} монет`;
    upgradeCost.textContent = reward;
    subBlock.style.top = '55%';
    document.getElementById('task-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';


    fetch('/user_data?user_id=' + userId)
        .then(res => res.json())
        .then(data => {
            if (data.success && data[`task_${taskKey}_done`]) {
                upgradeButton.disabled = true;
                upgradeButton.textContent = 'Уже получено';
            } else {
                upgradeButton.disabled = false;
                upgradeButton.textContent = 'Получить';
                upgradeButton.onclick = function () {
                    fetch('/claim_task_reward', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ user_id: userId, task: taskKey, reward: reward })
                    })
                    .then(res => res.json())
                    .then(response => {
                        if (response.success) {
                            window.open(link, '_blank');
                            upgradeButton.textContent = 'Уже получено';
                            upgradeButton.disabled = true;
                        } else {
                            alert(response.message);
                        }
                    });
                };
            }
        });
}

document.querySelectorAll('.days, .days7').forEach((el, index) => {
    el.addEventListener('click', () => {
        fetch('/claim_daily_reward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: USER_ID })
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert(`Получено ${res.reward} монет!`);
                el.classList.add('claimed');
            } else {
                alert(res.message);
            }
        });
    });
});


fetch(`/user_data?user_id=${USER_ID}`)
    .then(res => res.json())
    .then(data => {
        if (!data.success) return;

        const today = new Date();
        const lastClaimDate = new Date(data.last_reward_claim_date);
        const daysSince = Math.floor((today - lastClaimDate) / (1000 * 60 * 60 * 24));
        const currentDay = daysSince === 0 ? data.daily_day : (daysSince === 1 ? (data.daily_day % 7) + 1 : 1);
        const claimedToday = (daysSince === 0 && data.daily_claimed);

        document.querySelectorAll('.days, .days7').forEach((dayEl, index) => {
            const dayNumber = index + 1;

            if (dayNumber < currentDay) {
                dayEl.classList.add('past');
                dayEl.innerHTML += '<div class="label">Пропущено</div>';
            } else if (dayNumber > currentDay) {
                dayEl.classList.add('future');
                dayEl.innerHTML += '<div class="label">Недоступно</div>';
            } else {
                if (claimedToday) {
                    dayEl.classList.add('claimed');
                    dayEl.innerHTML += '<div class="label">Получено</div>';
                } else {
                    dayEl.classList.add('available');
                    dayEl.addEventListener('click', () => {
                        fetch('/claim_daily_reward', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: USER_ID })
                        })
                        .then(r => r.json())
                        .then(res => {
                            if (res.success) {
                                alert(`Вы получили ${res.reward} монет!`);
                                location.reload();
                            } else {
                                alert(res.message);
                            }
                        });
                    });
                }
            }
        });
    });
