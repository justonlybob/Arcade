// ===== UI CONSTANTS =====
const UI_CONFIG = {
    HEART: '❤️',
    ZOMBIE: '🧟',
    WAVE: '🌊'
};

// UI and score management
let score = 0;
let gameStats = {
    totalZombiesKilled: 0,
    totalBulletsFired: 0,
    bestWave: 1,
    sessionTime: 0
};

let sessionStartTime = 0;

// Initialize score
function initScore() {
    score = 0;
    gameStats.totalZombiesKilled = 0;
    gameStats.totalBulletsFired = 0;
    gameStats.bestWave = 1;
    sessionStartTime = Date.now();
}

// Increment score
function incrementScore(multiplier = 1) {
    score += multiplier;
    updateUI();
}

// Update UI
function updateUI() {
    const currentWave = getCurrentWave();
    if (currentWave > gameStats.bestWave) {
        gameStats.bestWave = currentWave;
    }
    
    const livesElement = document.getElementById('lives');
    const scoreElement = document.getElementById('score');
    const waveElement = document.getElementById('wave');
    
    if (livesElement) livesElement.textContent = player.lives;
    if (scoreElement) scoreElement.textContent = score;
    if (waveElement) waveElement.textContent = currentWave;
}

function getGameStats() {
    return {
        score: score,
        stats: gameStats,
        wave: currentWave
    };
}

// Get current score
function getScore() {
    return score;
}

// Format game stats
function getGameStats() {
    const elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    return {
        score: score,
        wave: getCurrentWave(),
        kills: zombiesKilled,
        bestWave: gameStats.bestWave,
        time: elapsedTime
    };
}
