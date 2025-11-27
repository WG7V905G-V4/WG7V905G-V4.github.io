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

const button = document.querySelectorAll('button');
button.forEach(button => {

    button.addEventListener("mouseover", ()=>{
        const [hue, saturation] = genColor(prevHue);
        prevHue = hue;
        if(!button.disabled) {
            button.style.backgroundColor = `hsl(${hue}, ${saturation-10}%, 50%)`;
            button.style.color = `#fff`;
        }
    });

    button.addEventListener("mouseout", ()=> {
        if (!button.disabled) {
            button.style.backgroundColor = "";
            button.style.color = "";
        }
    });

})

mainBtn.addEventListener("click", ()=>{
    mainBtn.style.backgroundColor = "";
    mainBtn.style.color = "";
});


const numButtons = document.querySelectorAll(".num-btn");
numButtons.forEach(numButton => {
    numButton.addEventListener("click", () => {
        userCountSpan.textContent = showCount =
            numButton.id === "increment"
                ? Math.min(showCount + 1, 999)
                : Math.max(showCount - 1, 0);
    });
})



let level = 0;
let showCount = userCountSpan.textContent =0;
let topScore = localStorage.getItem("topScore")||0;


function setState(key, rightAnswer=null) {
    showCount = userCountSpan.textContent =0;
    const stateLogic = {

        "start": () => {
            btnState(mainBtn,true, "start game");
            numButtons.forEach(numButton => {numButton.disabled = true;});
            btnHandler(mainBtn, ()=>{
                setState("anim");
            });
        },

        "anim":async ()=>{
            btnState([mainBtn, incBtn,decBtn],false, "count")
            const correctNum = await animation();
            setState("input", correctNum);
        },

        "input":()=>{
            btnState([mainBtn, incBtn,decBtn],true, "done");
            btnHandler(mainBtn, async () => {
                btnState([mainBtn, incBtn, decBtn], false, "done");
                await answerAnim(rightAnswer === showCount);
            });
        }
    }

    if (stateLogic[key]) {
        stateLogic[key]();
    }
}



function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000))
}

async function animation() {
    const time = Math.max(2 - level * 0.1, 0.1);
    const move = time * 0.3;
    const weight = time * 0.7;
    const ballsDiv = ballGenerator(level, centerBall.getBoundingClientRect(), move);

    await new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ballsDiv.forEach(([ballDiv, translate, filter]) => {
                    ballDiv.style.transform = translate;
                    ballDiv.style.filter = filter;
                });
                resolve();
            });
        });
    })

    await delay(move + weight);

    ballsDiv.forEach(([ballDiv]) => {
        ballDiv.style.transform = "translate(0, 0)";
        ballDiv.style.filter = `blur(0px)`
    });

    await delay(move);

    ballsDiv.forEach(([ballDiv]) => ballDiv.remove());

    return ballsDiv.length;
}


async function answerAnim(right=false) {
    centerBall.style.background = right? "#00aa2a":"#df0d38";
    centerBall.style.filter = "blur(22px)";

    if(right){
        level++;
        scoreSpan.textContent = level;
        if (level > topScore) {
            topScore = level;
            topScoreSpan.textContent = topScore;
        }
    }

    await delay(0.6);

    centerBall.style.background = "#dadada";
    centerBall.style.filter = "blur(0px)";

    await delay(0.6);

    if(!right){
        localStorage.setItem("topScore", topScore);
        level = 0;
        scoreSpan.textContent = level;
    }
    setState(right? "anim":"start");
}


window.onload = async () => {

    scoreSpan.textContent = level;
    topScoreSpan.textContent = topScore;
    setState("start");
};