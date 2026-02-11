const scoreDisplay = document.getElementById('score');
const healthDisplay = document.getElementById('health');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreSpan = document.getElementById('finalScore');
const cloudsCollectedSpan = document.getElementById('cloudsCollected');

export function updateScoreDisplay(score) {
    scoreDisplay.textContent = 'Score: ' + score;
}

export function updateHealthDisplay(health) {
    const hearts = ['', '❤️', '❤️❤️', '❤️❤️❤️'];
    const h = Math.max(0, Math.min(3, Math.floor(health)));
    healthDisplay.textContent = 'Health: ' + hearts[h];
}

export function showGameOver(score, cloudsCollected) {
    gameOverScreen.style.display = 'block';
    finalScoreSpan.textContent = score;
    cloudsCollectedSpan.textContent = cloudsCollected;
}

export function makeScorePop(x, y, text) {
    const el = document.createElement('div');
    el.className = 'score-pop';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.getElementById('gameContainer').appendChild(el);
    requestAnimationFrame(() => el.classList.add('hide'));
    setTimeout(() => el.remove(), 800);
}

export function setPlayAgainHandler(handler) {
    const btn = document.getElementById('playAgainBtn');
    if (btn) btn.addEventListener('click', handler);
}