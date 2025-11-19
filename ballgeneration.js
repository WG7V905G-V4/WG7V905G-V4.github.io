
export function getRandomBallsCount(level) {
    const min = 3;
    const max = Math.max(min + 1, Math.floor(level/3) + 5);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function genColor() {
    let hue = Math.floor(Math.random() * 361); // 0 ... 360
    const saturation = Math.floor(Math.random() * 31 + 70); // 60 ... 100
    return `hsl(${hue}, ${saturation}%, 50%)`;
}


export function getRandomSize(centerRadius) {
    return Math.random() * 20 + centerRadius * 0.7;
}

export class Ball {
    constructor(radius, color, top, left, toTop, toLeft, blur) {
        this.radius = radius;
        this.color = color;
        this.top = top;
        this.left = left;
        this.toTop = toTop;
        this.toLeft = toLeft;
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
        const radius = getRandomSize(centerBallDiameter);
        const distance = 100 + Math.random() * 40;
        const distanceX = Math.cos(angle) * distance;
        const distanceY = Math.sin(angle) * distance;
        const color = genColor();

        const top = (grayBallCenterY - radius / 2) + "px";
        const left = (grayBallCenterX - radius / 2) + "px";
        const toTop = (grayBallCenterY + distanceY - radius / 2) + "px";
        const toLeft = (grayBallCenterX + distanceX - radius / 2) + "px";

        yield new Ball(
            radius + "px",
            color,
            top,
            left,
            toTop,
            toLeft
        );
    }
}
