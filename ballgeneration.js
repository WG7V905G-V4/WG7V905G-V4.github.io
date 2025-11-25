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

function genColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 31 + 70);
    return `hsl(${hue}, ${saturation}%, 50%)`;
}




export class Ball {
    constructor(radius, color, top, left, distanceX, distanceY, blur) {
        this.radius = radius;
        this.color = color;
        this.top = top;
        this.left = left;
        this.distanceX = distanceX;
        this.distanceY = distanceY;
        this.blur = blur;
    }
}


export function* ballGenerator(level, centerRect) {
    const numOfBalls = getRandomBallsCount(level);


    const grayBallCenterX = centerRect.left + (centerRect.width/2) ;
    const grayBallCenterY = centerRect.top + (centerRect.height/2)  + window.scrollY;
    const centerBallDiameter = centerRect.width * 0.8;


    const biasAngle = Math.random() * 100;


    for (let i = 0; i < numOfBalls; i++) {
        const angle = ((2 * Math.PI) * i / numOfBalls) + (Math.random()*3 - 0.5) * 0.05 + biasAngle;
        const radius = centerBallDiameter+Math.min(Math.max(Math.random(), 1/(level+1)), 0.7)


        const color = genColor();


        const top = (grayBallCenterY - radius / 2) + "px";
        const left = (grayBallCenterX - radius / 2) + "px";


        const distance = 100 + Math.random() * 80;
        const distanceX = Math.cos(angle) * distance;
        const distanceY = Math.sin(angle) * distance;





        yield new Ball(
            radius + "px",
            color,
            top,
            left,
            distanceX,
            distanceY
        );
    }
}

