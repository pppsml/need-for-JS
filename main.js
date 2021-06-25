const HEIGHT_ELEM = 100;

const score        = document.querySelector('.score'),
    scoreContainer = document.querySelector('.score_container'),
    scoreRecord    = document.querySelector('.score_record'),
    startMenu      = document.querySelector('.start__menu'),
    startBtn       = document.querySelector('.start'),
    diffBtn        = document.querySelectorAll('.difficulty__button'),
    diffSelected   = document.querySelector('.difficulty-selected'),
    gameArea       = document.querySelector('.gameArea'),
    recordModal    = document.querySelector('.record_alert__wrapper'),
    recordAlert    = document.querySelector('.record_alert'),
    closeBtn       = document.querySelector('.close'),
    car            = document.createElement('div');

let JSONMaxScore;
let maxScore;
let currentMusic


const music=[
    './audio/let-me-die.mp3'
]
const audio = new Audio();
audio.src = music[0]
audio.volume = 0.1

car.classList.add('car');

startBtn.addEventListener('click', startGame);
closeBtn.addEventListener('click', closeRecordModal);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


diffBtn.forEach((item) => {
    item.addEventListener('click', () => {
        if (item.classList.contains('easy')) {
            setting.speed = 3;
            setting.traffic = 3.5;
            diffSelected.textContent = 'Выбрана сложность: легкая'
            diffBtn.forEach((item) => {
                item.classList.remove('active')
            })
            item.classList.add('active')
        } else if (item.classList.contains('medium')) {
            setting.speed = 5;
            setting.traffic = 3;
            diffSelected.textContent = 'Выбрана сложность: средняя'
            diffBtn.forEach((item) => {
                item.classList.remove('active')
            })
            item.classList.add('active')
        } else if (item.classList.contains('hard')) {
            setting.speed = 7;
            setting.traffic = 2.5;
            diffSelected.textContent = 'Выбрана сложность: сложная'
            diffBtn.forEach((item) => {
                item.classList.remove('active')
            })
            item.classList.add('active')
        };
    });
});

const keys = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowDown: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 3
};


const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5']


function random(num) {
    return Math.floor(Math.random() * num)
}

function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1
};

function startGame() {
    gameArea.style.minHeight = ''
    gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - (scoreContainer.offsetHeight + 40)) / HEIGHT_ELEM) * HEIGHT_ELEM;

    gameArea.innerHTML = '';
    startMenu.classList.add('hide')
    scoreContainer.classList.remove('hide');
    gameArea.classList.remove('hide');

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.y = (i * HEIGHT_ELEM);
        gameArea.append(line);
    };

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'rgba(0, 0, 0, 0) url(./image/' + enemyStyles[random(enemyStyles.length)] + '.png) center / cover no-repeat';
        gameArea.append(enemy);
    };

    setting.score = 0
    setting.start = true;
    gameArea.append(car);
    car.style.left = ((gameArea.offsetWidth/2) - (car.offsetWidth/2)) + 'px';
    car.style.top = 'auto'
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    audio.autoplay = true
    audio.play()
    // playMusic(0)
    requestAnimationFrame(playGame);
};

function playGame() {
    setting.score +=setting.speed
    score.innerHTML = 'SCORE<br> ' + setting.score
    // if (localStorage.getItem('maxScore') !== null) {
    //     scoreRecord.innerHTML = 'Record<br> ' + maxScore
    // } else {
    //     JSONMaxScore = JSON.stringify(setting.score)
    // }
    moveRoad();
    moveEnemy();
    if (setting.start) {
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= 4
        };
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += 4
        };
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += 4
        };
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= 4
        };
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
};

function startRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true
    }
};

function stopRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = false
    }
};

function moveRoad() {
    let lines = document.querySelectorAll('.line')
    lines.forEach(function(line) {
        line.y += setting.speed * 1.5;
        line.style.top = line.y + 'px';
        if (line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
};

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top+2 <= enemyRect.bottom-2 &&
            carRect.right-5 >= enemyRect.left+2 &&
            carRect.left+5 <= enemyRect.right-2 &&
            carRect.bottom-2 >= enemyRect.top+2) {
                setting.start = false;

                audio.pause();
                audio.currentTime = 0;
                audio.autoplay = false;

                startMenu.classList.remove('hide');
                setting.speed = 5;
                setting.traffic = 3;
                diffSelected.textContent = ''
                diffBtn.forEach((item) => {
                    item.classList.remove('active')
                })

                // if (setting.score > maxScore) {
                //     JSONMaxScore = JSON.stringify(setting.score)
                //     localStorage.setItem('maxScore', JSONMaxScore)
                //     openRecordModal()
                // }
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            item.style.background = 'rgba(0, 0, 0, 0) url(./image/' + enemyStyles[random(enemyStyles.length)] + '.png) center / cover no-repeat';
        }
    });
};

function openRecordModal() {
    recordModal.classList.remove('hide')
    recordAlert.innerHTML = 'Поздравляем!<br>Вы установили новый рекорд:<br>' + maxScore
}

function closeRecordModal() {
    recordModal.classList.add('hide')
}

// function playMusic(num) {
//     currentMusic = num;
//     audio.src = music[num];
//     audio.play();
//     audio.autoplay = true;
//     currentMusic += 1;
//     if(currentMusic > music.length) {
//         currentMusic = 0
//     }
//     setTimeout(playMusic(currentMusic), audio.duration * 1000)
// }