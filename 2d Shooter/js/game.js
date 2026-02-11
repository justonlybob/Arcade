// ===== GAME CONSTANTS =====
const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60
};

// Main game file
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = GAME_CONFIG.CANVAS_WIDTH;
canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

// Game state
let gameRunning = true;
let isPaused = false;
let frameCount = 0;
let deltaTime = 0;
let lastFrameTime = Date.now();

// Pause/Resume functionality
function togglePause() {
    if (!gameRunning) return;
    isPaused = !isPaused;
    const overlay = document.getElementById('gameOverlay');
    if (overlay) overlay.style.display = isPaused ? 'flex' : 'none';
}

// End game
function endGame() {
    gameRunning = false;
    const finalStats = getGameStats();
    document.getElementById('finalScore').textContent = finalStats.score;
    document.getElementById('gameOver').style.display = 'block';
}

// Restart game
function restartGame() {
    gameRunning = true;
    isPaused = false;
    frameCount = 0;
    
    initScore();
    initPlayer(canvas.width, canvas.height);
    initBullets();
    initZombies();
    initGhosts();
    initTrashYard(canvas.width, canvas.height);
    
    document.getElementById('gameOver').style.display = 'none';
    updateUI();
    
    spawnWave(canvas.width, canvas.height);
}

// Game loop
function gameLoop() {
    const currentTime = Date.now();
    deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.016);
    lastFrameTime = currentTime;
    frameCount++;
    
    if (gameRunning && !isPaused) {
        updatePlayer();
        updateBullets(canvas.width, canvas.height);
        updateZombies();
        updateGhosts();
        checkAllCollisions();
        
        if (allZombiesDead() && allGhostsDead()) {
            nextWave();
            updateUI();
            spawnWave(canvas.width, canvas.height);
        }
    }
    
    render(ctx, canvas.width, canvas.height);
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
function initGame() {
    try {
        setupPlayerControls(canvas);
        
        canvas.addEventListener('click', (e) => {
            if (gameRunning && !isPaused) {
                shootBullet();
            }
        });
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                togglePause();
            }
        });
        
        initPlayer(canvas.width, canvas.height);
        initTrashYard(canvas.width, canvas.height);
        initBullets();
        initZombies();
        initGhosts();
        initScore();
        spawnWave(canvas.width, canvas.height);
        updateUI();
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
    
    gameLoop();
}

// Start game
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
