// This file initializes the game, sets up event listeners, and starts the game loop.

let game;
let isGameRunning = false;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);
});

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        game = new Game();
        game.start();
    }
}

function gameLoop() {
    if (isGameRunning) {
        game.update();
        requestAnimationFrame(gameLoop);
    }
}