// ballgeneration.js

// Генерация случайного количества шариков в зависимости от уровня
export function getRandomBallsCount(level) {
    // min = 3, max увеличивается с уровнем
    const min = 3;
    const max = Math.max(min + 1, Math.floor(level/3) + 5);
    // Рандомное целое число в диапазоне [min, max]
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Генерация случайного цвета HSL
export function genColor() {
    const hue = Math.floor(Math.random() * 361); // 0 ... 360
    const saturation = Math.floor(Math.random() * 41 + 60); // 60 ... 100
    return `hsl(${hue}, ${saturation}%, 50%)`;
}

// Генерация случайного размера
export function getRandomSize(centerRadius) {
    // Увеличивай чуть выше для визуального разнообразия
    return Math.random() * 20 + centerRadius * 0.7;
}

// Класс для представления шарика
export class Ball {
    constructor(radius, color, top, left, toTop, toLeft) {
        this.radius = radius;      // строка, например "34px"
        this.color = color;        // строка цвета для CSS
        this.top = top;            // изначальный top (строка, px)
        this.left = left;          // изначальный left (строка, px)
        this.toTop = toTop;        // конечный top (строка, px)
        this.toLeft = toLeft;      // конечный left (строка, px)
    }
}

// Генератор шариков
export function* ballGenerator(level, centerRect) {
    const numOfBalls = getRandomBallsCount(level);

    // Центр серого шара
    const grayBallCenterX = centerRect.left + (centerRect.width/2) ;
    const grayBallCenterY = centerRect.top + (centerRect.height/2)  + window.scrollY;

    const centerBallDiameter = centerRect.width * 0.8;
    const biasAngle = Math.random() * 100;
    for (let i = 0; i < numOfBalls; i++) {

        const angle = ((2 * Math.PI) * i / numOfBalls) + (Math.random()*3 - 0.5) * 0.05 + biasAngle;
        const radius = getRandomSize(centerBallDiameter);
        const distance = 100 + Math.random() * 40; // немного разброса, шарики не в идеальном круге
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
