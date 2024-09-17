let bottom = document.getElementById('bottom');
let timer;
let startTimer;
let randomHit;
let score = 0;
let timerInterval;

document.getElementById('start').addEventListener('click',()=>{
    startTimer = 3;
    timer = 30;
    clearInterval(timerInterval);
    let startInterval = setInterval(() => {
        if (startTimer >= 0) {
            bottom.innerHTML = `<h1>${startTimer}</h1>`;
            startTimer--;
        } else {
            clearInterval(startInterval)
            decreaseTimer();
            getClickedBubble();
            createRandomHit();
            createBubble();
        }
    }, 1000);
});

function createBubble() {
    let clutter = '';
    for (let i = 0; i < 200; i++) {
        let randombubble = Math.floor(Math.random()*10);
        clutter += `<div class="bubble">${randombubble}</div>`
    }
    bottom.innerHTML = clutter;
}

function createRandomHit() {
    randomHit = Math.floor(Math.random()*10);
    document.getElementById('hit').innerText = randomHit;
}

function increaseScore() {
    score += 10;
    document.getElementById('score').innerText = score;

}

function getClickedBubble() {
    bottom.addEventListener('click',(event)=>{
        let clickedBubble = Number(event.target.innerHTML);
        if(clickedBubble === randomHit){
            increaseScore();
            createRandomHit();
            createBubble();
        }
    })
}


function decreaseTimer(){
    timer = 30;
    timerInterval = setInterval(() => {
        if (timer >= 0) {
            document.getElementById('timer').innerHTML = timer;
            timer--;
        } else {
            bottom.innerHTML = `<h1>Game Over</h1>`;
            clearInterval(timerInterval);
        }
    }, 1000);
}