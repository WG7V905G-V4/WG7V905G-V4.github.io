import { ballGenerator } from './ballgeneration.js';
import { btnState, btnHandler } from './btnStates.js';

const userCountSpan = document.getElementById("user-count");
const centerBall = document.getElementById("center-ball");
const scoreSpan = document.getElementById("score");
const topScoreSpan = document.getElementById("topScore");
const decBtn = document.getElementById("decrement");
const incBtn = document.getElementById("increment");
const mainBtn = document.getElementById("main-btn");



let level = 0;
let gameState = "start";
let showCount = 0;
let topScore = localStorage.getItem("topScore")||0;

function padding(n) {
    return String(n).padStart(3, '0');
}

function setUserCount(n) {
    showCount = n;
    userCountSpan.textContent = padding(n);
}

function start(){
    btnState(
        mainBtn,
        true
    )

    btnState(
        [incBtn, decBtn],
        false
    )

    btnHandler(mainBtn, () => {
        if (gameState === "start") count();
    });
    btnHandler(incBtn, () => {
        if (gameState === 'input') setUserCount(Math.min(showCount + 1, 999));
    });
    btnHandler(decBtn, () => {
        if (gameState === "input") setUserCount(Math.max(showCount - 1, 0));
    });
}


function count() {
    gameState = "anim";
    btnState(
        mainBtn,
        false,
        "count");
    btnState(
        [incBtn, decBtn],
        false
    )
        
    animation();
}

function* htmlBall(ballObj, time){
    let ballDiv = document.createElement("div");
    ballDiv.className = "ball";
    ballDiv.style.width = ballDiv.style.height = ballObj.radius;
    ballDiv.style.background = ballObj.color;
    ballDiv.style.top = ballObj.top;
    ballDiv.style.left = ballObj.left;
    ballDiv.style.opacity = "1";
    ballDiv.style.transition = `transform ${time}s`;
    document.body.appendChild(ballDiv);
    yield ballDiv;
}

function animation() {
    const time = Math.max(5-level*0.1, 1);
    const move = time*0.3;
    const weight = time*0.7;
    const ballsCLass = [...ballGenerator(level, centerBall.getBoundingClientRect())];
    const ballsDiv = [];
    for (const ballObj of ballsCLass) {
        if (ballObj) ballsDiv.push(htmlBall(ballObj, move).next().value);
    }
    
    btnState(
        mainBtn,
        false
        )

    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            ballsDiv.forEach((ballDiv, i) => {
                ballDiv.style.transform = `translate(${ballsCLass[i].distanceX}px, ${ballsCLass[i].distanceY}px)`;
            });
        })
    })

    setTimeout(() => {
        ballsDiv.forEach((ballDiv, i) => {
            ballDiv.style.transform = "translate(0, 0)";
        });
        setTimeout(() => {
            ballsDiv.forEach(ball => ball.remove());
        }, weight);
    }, move);

    inputStage(ballsDiv.length);
}


function inputStage(rightAnswer) {
    gameState = "input";
    setUserCount(0);


    btnState(
        [incBtn, decBtn],
        true
    )
    setTimeout(() => {
        btnState(
            mainBtn,
            true,
            "done"
        );

        btnHandler(mainBtn, () =>
        {
            btnState(
                [incBtn, decBtn],
                false
            )
            if (gameState !== "input") return;
            if (rightAnswer === showCount) rightAnswerAnim();
            else wrongAnswerAnim();
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

function wrongAnswerAnim() {
    centerBall.style.background = "#df0d38";
    centerBall.style.filter = "blur(22px)";

    setTimeout(() => {
        resetGame(true);
    }, 1100);
}

function resetGame(fail = false) {
    centerBall.style.background = "#dadada";
    centerBall.style.filter = "blur(0px)";
    setUserCount(0);
    gameState = fail ? "start" : "anim";

    btnState(
        [incBtn, decBtn],
        false
    )

    if (fail) {
        localStorage.setItem("topScore", topScore);
        level = 0;
        scoreSpan.textContent = level;
        btnHandler(mainBtn, start);
        btnState(
            mainBtn,
            true,
            "start game",
        );
    } else {
        count();
    }
}

window.onload = async () => {
    setUserCount(0);
    scoreSpan.textContent = level;
    topScoreSpan.textContent = topScore;
    start()
};