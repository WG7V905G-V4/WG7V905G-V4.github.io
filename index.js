import { ballGenerator } from './ballgeneration.js';

// DOM элементы
const userCountSpan = document.getElementById("user-count");
const centerBall = document.getElementById("center-ball");
const mainBtn = document.getElementById("main-btn");
const decBtn = document.getElementById("decrement");
const incBtn = document.getElementById("increment");
const scoreSpan = document.getElementById("score");
const topScoreSpan = document.getElementById("topScore");

// Состояния
let level = 0;
let gameState = "start";
let showCount = 0;
let topScore = 0;
let userIp = null;
let retrySend = false;
let pendingScore = 0;

const SERVER_HOST = "http://172.16.2.87:8080";

// Получение IP устройства
async function getUserIp() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip || null;
    } catch (e) {
        console.error("Не удалось получить IP адрес", e);
        return null;
    }
}

// Работа с сервером
async function getTopScore(ip) {
    if (!ip) {
        console.warn("getTopScore: IP не указан");
        return 0;
    }
    try {
        const response = await fetch(`${SERVER_HOST}/get_score?user_ip=${encodeURIComponent(ip)}`);
        const data = await response.json();
        if (typeof data.score === "number") return data.score;
        return 0;
    } catch (e) {
        console.error("getTopScore error", e);
        return 0;
    }
}
async function updateTopScore(ip, score) {
    if (!ip) {
        console.warn("updateTopScore: IP не указан");
        return;
    }
    try {
        const response = await fetch(`${SERVER_HOST}/update_score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIp: ip, score: score })
        });
        if (!response.ok) throw new Error("Server error");
        retrySend = false;
        console.log("Рекорд отправлен!", score);
    } catch (e) {
        console.error("updateTopScore ошибка", e);
        retrySend = true;
        pendingScore = score;
    }
}

// UI-методы
function padding(n) {
    return String(n).padStart(3, '0');
}
function setUserCount(n) {
    showCount = n;
    userCountSpan.textContent = padding(n);
}
function setMainBtnHandler(handler) {
    mainBtn.onclick = null;
    mainBtn.onclick = handler;
}
function setMainBtnState({ text, disabled, bg, color, filter }) {
    mainBtn.textContent = text;
    mainBtn.classList.toggle("disabled", disabled);
    mainBtn.style.pointerEvents = disabled ? "none" : "auto";
    if (bg) mainBtn.style.background = bg;
    if (color) mainBtn.style.color = color;
    if (filter) mainBtn.style.filter = filter;
}

incBtn.onclick = () => {
    if (gameState === "input") setUserCount(Math.min(showCount + 1, 999));
};
decBtn.onclick = () => {
    if (gameState === "input") setUserCount(Math.max(showCount - 1, 1));
};
function startGame() {
    if (gameState !== "start") return;
    countMessage();
}
setMainBtnHandler(startGame);

// --- Основной игровой цикл ---
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
    const ballsCLass = [...ballGenerator(level, centerBall.getBoundingClientRect())];
    const ballsDiv = [];
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
        ballsDiv.forEach((ballDiv, i) => {
            ballDiv.style.transition =
                "top 0.7s cubic-bezier(.4,0,.2,1), left 0.7s cubic-bezier(.4,0,.2,1), opacity 380ms cubic-bezier(.4,0,.2,1)";
            ballDiv.style.opacity = "1";
            ballDiv.style.top = ballsCLass[i].toTop;
            ballDiv.style.left = ballsCLass[i].toLeft;
        });
    }, 100);
    setTimeout(() => {
        ballsDiv.forEach((ballDiv, i) => {
            ballDiv.style.opacity = "1";
            ballDiv.style.top = ballsCLass[i].top;
            ballDiv.style.left = ballsCLass[i].left;
        });
        setTimeout(() => {
            ballsDiv.forEach(ball => ball.remove());
            inputStage(ballsDiv.length);
        }, 900);
    }, 500 + Math.max(0, 650 - level * 60));
}
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
function rightAnswerAnim() {
    level++;
    scoreSpan.textContent = level;
    if (level > topScore) {
        topScore = level;
        topScoreSpan.textContent = topScore;
    }
    centerBall.style.background = "#00aa2a";
    centerBall.style.filter = "blur(22px)";
    setTimeout(() => {
        resetGame(false);
    }, 1200);
}
function wrongAnswer() {
    centerBall.style.background = "#ef1e48";
    centerBall.style.filter = "blur(22px)";
    setTimeout(() => {
        resetGame(true);
    }, 1100);
}
function resetGame(fail = false) {
    centerBall.style.background = "#ffffff";
    centerBall.style.filter = "blur(0px)";
    setUserCount(0);
    gameState = fail ? "start" : "anim";
    if (fail) {
        if (userIp !== null) {
            updateTopScore(userIp, topScore);
        }
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
        countMessage();
    }
}

// Периодическая отправка сохранения рекорда
setInterval(() => {
    if (retrySend && userIp !== null) {
        updateTopScore(userIp, pendingScore);
    }
}, 60000);

// Главная инициализация
window.onload = async () => {
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
    // Получаем IP и только после этого топ-скор
    userIp = await getUserIp();
    if (userIp) {
        topScore = await getTopScore(userIp);
        topScoreSpan.textContent = topScore;
    } else {
        console.warn("IP пользователя не определен");
    }
};
