const userCountSpan = document.getElementById("user-count");
const centerBall = document.getElementById("center-ball");
const mainBtn = document.getElementById("main-btn");
const decBtn = document.getElementById("decrement");
const incBtn = document.getElementById("increment");
const scoreSpan = document.getElementById("score");
const topScoreSpan = document.getElementById("topScore");

let roundCount = 0;
let topScore = 0;
let gameState = "start";
let showCount = 0;
const COLORS = ['#ed4154', '#33ffd6', '#ffd700', '#3ce63c', '#b100ff', '#00c3ff'];

function pad3(n) {
    return String(n).padStart(3, '0');
}
function setUserCount(n) {
    userCountSpan.textContent = pad3(n);
}
function getRandomBallsCount(level) {
    return Math.floor(Math.random() * (3 + level)) + 2;
}
function getRandomSize(centerRadius) {
    return Math.random() * 20 + centerRadius * 0.5;
}

mainBtn.onclick = () => {
    if (gameState !== "start") return;
    startCountdown();
};

incBtn.onclick = () => {
    if (gameState !== "input") return;
    showCount = Math.min(showCount+1, 99);
    setUserCount(showCount);
};
decBtn.onclick = () => {
    if (gameState !== "input") return;
    showCount = Math.max(showCount-1, 1);
    setUserCount(showCount);
};

function startCountdown() {
    gameState = "anim";
    mainBtn.classList.add("disabled");
    let steps = ["3", "2", "1"];
    let i = 0;

    mainBtn.textContent = steps[i];
    mainBtn.style.background = "#dadada";
    mainBtn.style.color = "#23232a";
    let interval = setInterval(() => {
        i++;
        if (i < steps.length) {
            mainBtn.textContent = steps[i];
        } else {
            clearInterval(interval);
            mainBtn.textContent = "";
            mainBtn.style.background = "#353542";
            animateBalls();
        }
    }, 800);
}

function animateBalls() {
    let centerRect = centerBall.getBoundingClientRect();
    let cx = centerRect.left + centerRect.width / 2;
    let cy = centerRect.top + centerRect.height / 2 + window.scrollY;

    let ballsCount = getRandomBallsCount(roundCount);
    showCount = 1;
    setUserCount(showCount);

    let radii = [];
    let angles = [];
    let balls = [];

    for (let i = 0; i < ballsCount; ++i) {
        let angle = (2 * Math.PI * i) / ballsCount + Math.random() * 0.22;
        angles.push(angle);
        let radius = getRandomSize(34);

        radii.push(radius);

        let ball = document.createElement("div");
        ball.className = "ball";
        ball.style.width = ball.style.height = radius + "px";
        ball.style.background = COLORS[Math.floor(Math.random()*COLORS.length)];

        let launchDist = 120; // расстояние вылета

        // стартовое положение в центре за серым шаром и прозрачные
        ball.style.top = (cy - radius / 2) + "px";
        ball.style.left = (cx - radius / 2) + "px";
        ball.style.opacity = "0";
        document.body.appendChild(ball);
        balls.push(ball);
    }

    // Выстреливание из центра
    setTimeout(() => {
        for (let i = 0; i < ballsCount; ++i) {
            // позиция вылета за пределы экрана и обратно
            let dx = Math.cos(angles[i]) * 100;
            let dy = Math.sin(angles[i]) * 100;

            balls[i].style.transition = "top 0.7s cubic-bezier(.4,0,.2,1), left 0.7s cubic-bezier(.4,0,.2,1), opacity 380ms cubic-bezier(.4,0,.2,1)";
            balls[i].style.opacity = "1";
            balls[i].style.top = (cy + dy - radii[i] / 2) + "px";
            balls[i].style.left = (cx + dx - radii[i] / 2) + "px";
        }
    }, 100);

    // Залет обратно
    setTimeout(() => {
        for (let i = 0; i < ballsCount; ++i) {
            balls[i].style.transition = "top 0.85s cubic-bezier(.4,0,.2,1), left 0.85s cubic-bezier(.4,0,.2,1), opacity 400ms cubic-bezier(.4,0,.2,1)";
            balls[i].style.opacity = "0";
            balls[i].style.top = (cy - radii[i] / 2) + "px";
            balls[i].style.left = (cx - radii[i] / 2) + "px";
        }
        setTimeout(() => {
            balls.forEach(ball => ball.remove());
            inputStage(ballsCount);
        }, 900);
    }, 900 + Math.max(0, 650 - roundCount * 60));
}

function inputStage(answer) {
    gameState = "input";
    showCount = 1;
    setUserCount(showCount);

    mainBtn.classList.add("disabled");
    mainBtn.style.background = "#dadada";
    mainBtn.style.color = "#23232a";
    mainBtn.style.filter = "blur(10px)";
    mainBtn.textContent = "";

    setTimeout(() => {
        mainBtn.textContent = "Done";
        mainBtn.style.background = "#353542";
        mainBtn.style.color = "#23232a";
        mainBtn.classList.remove("disabled");
        mainBtn.style.filter = "blur(0px)";
        mainBtn.onclick = function() {
            checkAnswer(answer);
        };
    }, 650);
}

function checkAnswer(rightAnswer) {
    if (gameState !== "input") return;
    gameState = "result";
    mainBtn.classList.add("disabled");

    if (showCount === rightAnswer) {
        scoreSpan.textContent = ++roundCount;
        if (roundCount > topScore) {
            topScore = roundCount;
            topScoreSpan.textContent = topScore;
            updateBestScore(topScore);
        }
        centerBall.style.background = "#25ff58";
        centerBall.style.filter = "blur(22px)";
        setTimeout(resetGame, 1200);
    } else {
        centerBall.style.background = "#ef1e48";
        centerBall.style.filter = "blur(22px)";
        setTimeout(() => {
            resetGame(true);
        }, 1100);
    }
}

function resetGame(fail = false) {
    centerBall.style.background = "#dadada";
    centerBall.style.filter = "blur(0px)";
    mainBtn.className = "main-btn";
    mainBtn.textContent = "s";
    mainBtn.style.background = "#dadada";
    mainBtn.style.color = "#23232a";
    mainBtn.onclick = () => {
        if (gameState !== "start") return;
        startCountdown();
    };
    setUserCount(1);

    if (fail) {
        roundCount = 0;
        scoreSpan.textContent = "0";
    }
    gameState = "start";
}

function updateBestScore(score) {
    localStorage.setItem("bestScore", score);
}

window.onload = () => {
    const best = Number(localStorage.getItem("bestScore") || 0);
    if (best) topScore = best;
    topScoreSpan.textContent = topScore;
    setUserCount(1);
};
