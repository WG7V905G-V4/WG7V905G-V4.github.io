function getRandomBallsCount(level) {
    const absGameMax = 10;
    const steepness = 0.7;
    const levelBreakpoint = 10;
    const numSlope =1+Math.floor( absGameMax * (1/ (1+Math.E**(-steepness*(level - levelBreakpoint)))))
    const upper = numSlope>3;

    let max =  numSlope;
    let min = 3;
    if (!upper) {
        max = 3;
        min = numSlope;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function genColor(prev = null) {
    const hue = Math.floor(prev? prev+90+(Math.random()*40):Math.random() * 360);
    const saturation = Math.floor(Math.random() * 31 + 70);
    return [ hue, saturation ];
}

export class Ball {
    constructor(distanceX, distanceY, blur) {
        this.distanceX = distanceX;
        this.distanceY = distanceY;
        this.blur = blur;
    }
}


export function* ballGenerator(level, centerRect, time) {
    const numOfBalls = getRandomBallsCount(level);
    let prevHue = null;
    const grayBallCenterX = centerRect.left + (centerRect.width/2) ;
    const grayBallCenterY = centerRect.top + (centerRect.height/2)  + window.scrollY;
    const biasAngle = Math.random() * 100;
    for (let i = 0; i < numOfBalls; i++) {
        const angle = ((2 * Math.PI) * i / numOfBalls) + (Math.random()*3 - 0.5) * 0.05 + biasAngle;
        const radius = centerRect.width*Math.min(Math.max(Math.random(), 1/(1+level*0.1)), 0.7)
        const [hue, saturation] = genColor(prevHue);
        prevHue = hue;
        const color = `hsl(${hue}, ${saturation}%, 50%)`
        const top = (grayBallCenterY - radius / 2) + "px";
        const left = (grayBallCenterX - radius / 2) + "px";
        const distance = 100 + Math.random() * 80;
        const distanceX = Math.cos(angle) * distance;
        const distanceY = Math.sin(angle) * distance;
        const blur = level>10&&Math.random()>0.8? 5*Math.random()+2:0;


        let ballDiv = document.createElement("div");
        ballDiv.className = "ball";
        ballDiv.style.width = ballDiv.style.height = radius + "px";
        ballDiv.style.background = color;
        ballDiv.style.top = top;
        ballDiv.style.left = left;
        ballDiv.style.filter = "blur(0px)"
        ballDiv.style.transition = `transform ${time}s ease-in-out, filter ${time/3}s ease-in-out`;
        document.body.appendChild(ballDiv);


        yield [
            ballDiv,
            new Ball(
                distanceX,
                distanceY,
                blur
            )
        ];
    }
}

