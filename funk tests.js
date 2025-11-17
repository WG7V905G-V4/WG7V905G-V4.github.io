function getRandomBallsCount(level) {
    let max = Math.floor(level/3)+4;
    console.log(max);
    return Math.floor(Math.random() * (max - 3)) + 2;
}

console.log(getRandomBallsCount())