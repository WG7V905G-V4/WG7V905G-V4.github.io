import {ballGenerator, genColor} from './ballgeneration.js';
import { btnState, btnHandler } from './btnStates.js';

const userCountSpan = document.getElementById("user-count");
const centerBall = document.getElementById("center-ball");
const scoreSpan = document.getElementById("score");
const topScoreSpan = document.getElementById("topScore");
const decBtn = document.getElementById("decrement");
const incBtn = document.getElementById("increment");
const mainBtn = document.getElementById("main-btn");




let prevHue = null;
centerBall.addEventListener("mousedown", ()=>{
    const [hue, saturation] = genColor(prevHue);
    prevHue = hue;
    centerBall.style.transform = `scale(1.4)`
    centerBall.style.backgroundColor = `hsl(${hue}, ${saturation-10}%, 50%)`;
    centerBall.style.filter = "blur(10px)";
});
centerBall.addEventListener("mouseup", ()=>{
    centerBall.style.transform = ``
    centerBall.style.backgroundColor = ``;
    centerBall.style.filter = "";
})

mainBtn.addEventListener("click", ()=>{
    mainBtn.style.backgroundColor = "";
    mainBtn.style.color = "";
});



let level = 0;
let showCount = 0;
let topScore = localStorage.getItem("topScore")||0;


function setState(key, rightAnswer=null) {
    setUserCount(0);
    const stateLogic = {
        "start": () => {

            btnState(mainBtn,true, "start game");
            btnState([incBtn,decBtn],false)

            btnHandler(mainBtn, ()=>{
                setState("anim");
            });
        },
        "anim":()=>{
            btnState([mainBtn, incBtn,decBtn],false, "count")
            animation();
        },
        "input":()=>{
            btnState([mainBtn, incBtn,decBtn],true, "done");

            btnHandler(incBtn, () => {setUserCount(Math.min(showCount + 1, 999))});
            btnHandler(decBtn, () => {setUserCount(Math.max(showCount - 1, 0))});
            btnHandler(mainBtn, () => {
                btnState([incBtn, decBtn],false)
                answerAnim(rightAnswer === showCount);
            });
        }
    }
    if (stateLogic[key]) {
        stateLogic[key]();
    }
}


function padding(n) {
    return String(n).padStart(3, '0');
}

function setUserCount(n) {
    showCount = n;
    userCountSpan.textContent = padding(n);
}


function animation() {
    const time = Math.max(2 - level * 0.1, 0.1);
    const move = time * 0.3;
    const weight = time * 0.7;
    const ballsDiv = [...ballGenerator(level, centerBall.getBoundingClientRect(), move)];




    requestAnimationFrame(() => {
        requestAnimationFrame(() => {

            ballsDiv.forEach((ballDiv) => {
                ballDiv[0].style.transform = `translate(${ballDiv[1].distanceX}px, ${ballDiv[1].distanceY}px)`;
                ballDiv[0].style.filter = `blur(${ballDiv[1].blur}px)`
            });
        });
    });


    setTimeout(() => {

        setTimeout(() => {

            ballsDiv.forEach((ballDiv) => {
                ballDiv[0].style.transform = "translate(0, 0)";
                ballDiv[0].style.filter = `blur(0px)`
            });

            setTimeout(() => {
                setState("input", ballsDiv.length);
                ballsDiv.forEach(ball => ball[0].remove());
            }, move * 1000);

        }, weight * 1000);

    }, move * 1000);
}


function answerAnim(right=false) {
    if(right){
        level++;
        scoreSpan.textContent = level;
        if (level > topScore) {
            topScore = level;
            topScoreSpan.textContent = topScore;
        }
    }
    
    centerBall.style.background = right? "#00aa2a":"#df0d38";
    centerBall.style.filter = "blur(22px)";

    setTimeout(() => {

        setTimeout(()=>{
            if(!right){
                localStorage.setItem("topScore", topScore);
                level = 0;
                scoreSpan.textContent = level;
            }
            setState(right? "anim" : "start");

        }, 600)

        centerBall.style.background = "#dadada";
        centerBall.style.filter = "blur(0px)";

    }, 600);
}


window.onload = async () => {
    scoreSpan.textContent = level;
    topScoreSpan.textContent = topScore;
    setState("start");
};