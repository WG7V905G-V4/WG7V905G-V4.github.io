import { ballGenerator } from './ballgeneration.js';

const userCountSpan = document.getElementById("user-count");
const centerBall = document.getElementById("center-ball");
const mainBtn = document.getElementById("main-btn");
const decBtn = document.getElementById("decrement");
const incBtn = document.getElementById("increment");
const scoreSpan = document.getElementById("score");
const topScoreSpan = document.getElementById("topScore");

let level = 0;
let topScore = 0;
let gameState = "start";
let showCount = 0;

function padding(n) {
    return String(n).padStart(3, '0');
}

function setUserCount(n) {
    showCount = n;
    userCountSpan.textContent = padding(n);
}

// ---------- Логика смены обработчика mainBtn ----------
function setMainBtnHandler(handler) {
    mainBtn.onclick = null;
    mainBtn.onclick = handler;
}

function setMainBtnState({ text, disabled, bg, color, filter }) {
    mainBtn.textContent = text;
    if (disabled) {
        mainBtn.classList.add("disabled");
        mainBtn.style.pointerEvents = "none";
    } else {
        mainBtn.classList.remove("disabled");
        mainBtn.style.pointerEvents = "auto";
    }
    if (bg) mainBtn.style.background = bg;
    if (color) mainBtn.style.color = color;
    if (filter) mainBtn.style.filter = filter;
}

// ---------- Кнопки увеличения и уменьшения ----------
incBtn.onclick = () => {
    if (gameState !== "input") return;
    setUserCount(Math.min(showCount + 1, 999));
};
decBtn.onclick = () => {
    if (gameState !== "input") return;
    setUserCount(Math.max(showCount - 1, 1));
};

// ---------- Старт игры ----------
function startGame() {
    if (gameState !== "start") return;
    countMessage();
}
setMainBtnHandler(startGame);

// ---------- Фаза счёта и появления шариков ----------
function countMessage() {
    gameState = "anim";
    setMainBtnState({
        text: "count",
        disabled: true,
        bg: "#333",
        color: "#dadada",
        filter: "blur(0px)"
    });
    animation();
}

function animation() {
    gameState = "anim";
    let ballsCLass = [...ballGenerator(level, centerBall.getBoundingClientRect())];

    let ballsDiv = [];
    for (const ballObj of ballsCLass) {
        if (ballObj) {
            let ballDiv = document.createElement("div");
            ballDiv.className = "ball";
            ballDiv.style.width = ballDiv.style.height = ballObj.radius;
            ballDiv.style.background = ballObj.color;
            ballDiv.style.top = ballObj.top;
            ballDiv.style.left = ballObj.left;
            ballDiv.style.opacity = "1";
            document.body.appendChild(ballDiv);
            ballsDiv.push(ballDiv);
        }
    }

    setTimeout(() => {
        for (let i = 0; i < ballsDiv.length; ++i) {
            ballsDiv[i].style.transition =
                "top 0.7s cubic-bezier(.4,0,.2,1), left 0.7s cubic-bezier(.4,0,.2,1), opacity 380ms cubic-bezier(.4,0,.2,1)";
            ballsDiv[i].style.opacity = "1";
            ballsDiv[i].style.top = ballsCLass[i].toTop;
            ballsDiv[i].style.left = ballsCLass[i].toLeft;
        }
    }, 100);
    setTimeout(() => {
        for (let i = 0; i < ballsDiv.length; ++i) {
            ballsDiv[i].style.opacity = "1";
            ballsDiv[i].style.top = ballsCLass[i].top;
            ballsDiv[i].style.left = ballsCLass[i].left;
        }
        setTimeout(() => {
            ballsDiv.forEach(ball => ball.remove());
            inputStage(ballsDiv.length);
        }, 900);
    }, 500 + Math.max(0, 650 - level * 60));
}

// ---------- Ввод ответа ----------
function inputStage(rightAnswer) {
    gameState = "input";
    setUserCount(0);

    setMainBtnState({
        text: "count",
        disabled: true,
        bg: "#333",
        color: "#dadada",
        filter: "blur(0px)"
    });

    setTimeout(() => {
        setMainBtnState({
            text: "done",
            disabled: false,
            bg: "#dadada",
            color: "#333",
            filter: "blur(0px)"
        });

        setMainBtnHandler(() => {
            if (gameState !== "input") return;
            if (rightAnswer === showCount) {
                rightAnswerAnim();
            } else {
                wrongAnswer();
            }
        });
    }, 650);
}

// ---------- Анимация правильного ответа ----------
function rightAnswerAnim() {
    level++;
    scoreSpan.textContent = level;
    if (level > topScore) {
        topScore = level;
        topScoreSpan.textContent = topScore;
        localStorage.setItem("bestScore", topScore);
    }
    centerBall.style.background = "#00aa2a";
    centerBall.style.filter = "blur(22px)";
    setTimeout(() => {
        resetGame(false);
    }, 1200);
}

// ---------- Анимация неправильного ответа ----------
function wrongAnswer() {
    centerBall.style.background = "#ef1e48";
    centerBall.style.filter = "blur(22px)";
    setTimeout(() => {
        resetGame(true);
    }, 1100);
}

// ---------- Сброс игры ----------
function resetGame(fail = false) {
    centerBall.style.background = "#ffffff";
    centerBall.style.filter = "blur(0px)";
    setUserCount(0);
    gameState = fail ? "start" : "anim";
    if (fail) {
        level = 0;
        scoreSpan.textContent = "0";
        setMainBtnHandler(startGame);
        setMainBtnState({
            text: "start game",
            disabled: false,
            bg: "#dadada",
            color: "#23232a",
            filter: "blur(0px)"
        });
    } else {
        setTimeout(countMessage, 400);
    }
}

// ---------- Инициализация при загрузке ----------
window.onload = () => {
    topScore = parseInt(localStorage.getItem("bestScore")) || 0;
    topScoreSpan.textContent = topScore;
    setUserCount(0);
    scoreSpan.textContent = level;
    setMainBtnState({
        text: "start game",
        disabled: false,
        bg: "#dadada",
        color: "#23232a",
        filter: "blur(0px)"
    });
    setMainBtnHandler(startGame);
};

