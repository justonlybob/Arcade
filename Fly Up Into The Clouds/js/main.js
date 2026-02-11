import { Cloud } from './cloud.js';
import { Danger } from './danger.js';
import { Plane } from './plane.js';
import { Powerup } from './powerup.js';
import { isLeftPressed, isRightPressed, initInput, getKeys, checkCheatCode, checkMasterCheatCode } from './input.js';
import { playBeep } from './audio.js';
import { updateScoreDisplay, updateHealthDisplay, showGameOver, makeScorePop, setPlayAgainHandler } from './ui.js';
import { rectsIntersect } from './utils.js';

const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const chargeBar = document.getElementById('chargeBar');
const keys = getKeys();

// Game variables
let playerX = 180;
let playerY = 560;
let score = 0;
let health = 3;
let cloudsCollected = 0;
let gameActive = true;
let cameraOffset = 0;
let prevPlayerX = playerX;

// Movement smoothing
let velX = 0;
let velY = 0;
const accel = 0.95;
const friction = 0.88;
const gravity = 0.3;
const jumpPower = 12;
let isJumping = false;

// For pass-over detection using screen-space
let prevPlayerBottom = null;

// Game entities
const clouds = [];
const dangers = [];
const planes = [];
const powerups = [];

// Shield state
let hasShield = false;

// Destroyer mode state
let destroyerMode = false;
let destroyerEndTime = 0;

// God mode state
let godMode = false;

// Space charge system
let spacePressCount = 0;
let lastSpacePressed = false;

// Game stage tracking
let gameStage = 1;
let stageTriggered = false;

function getCameraOffset() { return cameraOffset; }

// Spawn clouds
function spawnCloud() { 
    if (gameActive) clouds.push(new Cloud(gameContainer, getCameraOffset, gameStage === 3 ? 800 : gameStage === 2 ? 550 : 400)); 
}
// Spawn dangers less frequently (lower base chance)
function spawnDanger() { 
    if (gameActive && Math.random() < 0.12) dangers.push(new Danger(gameContainer, getCameraOffset, gameStage === 3 ? 800 : gameStage === 2 ? 550 : 400)); 
}
// Spawn planes (stage 3 only)
function spawnPlane() {
    if (gameActive && gameStage === 3) {
        const spawnChance = score >= 10000 ? 0.4 : 0.08;  // Much higher spawn chance at 10000 points
        if (Math.random() < spawnChance) planes.push(new Plane(gameContainer, getCameraOffset, 750));
    }
}
// Spawn powerups rarely
function spawnPowerup() {
    if (gameActive && !hasShield && !destroyerMode && !godMode) {
        // Check for god mode first (extremely rare)
        if (Math.random() < 0.000001) {
            powerups.push(new Powerup(gameContainer, getCameraOffset, 'godmode'));
            return;
        }
        // Higher destroyer chance at higher stages
        let destroyerChance = 0.5;  // Stage 1
        if (gameStage === 2) destroyerChance = 0.65;
        if (gameStage === 3) destroyerChance = 0.95;  // Almost always destroyer at stage 3
        const type = Math.random() < destroyerChance ? 'destroyer' : 'shield';
        powerups.push(new Powerup(gameContainer, getCameraOffset, type));
    }
}

// Update game state
function update() {
    if (!gameActive) return;

    // Check for cheat code: 8 0 0 to jump to 800 points
    if (checkCheatCode()) {
        score = 800;
        updateScoreDisplay(score);
    }

    // Check for master cheat code: m a s t e r k e y
    if (checkMasterCheatCode()) {
        score = 5000;
        gameStage = 3;
        gameContainer.style.width = '750px';
        spacePressCount = 10;  // Full charge bar
        const chargePercent = 100;
        chargeBar.style.setProperty('--charge-width', chargePercent + '%');
        updateScoreDisplay(score);
        makeScorePop(playerX + 20 - gameContainer.getBoundingClientRect().left, playerY - gameContainer.getBoundingClientRect().top, 'MASTER KEY ACTIVATED!');
        playBeep('collect');
    }

    // Player movement (smoothed)
    const leftPressed = isLeftPressed();
    const rightPressed = isRightPressed();

    if (leftPressed) velX -= accel;
    if (rightPressed) velX += accel;

    velX *= friction;
    playerX += velX;

    // Vertical movement with gravity
    velY += gravity;
    playerY += velY;
    // Prevent falling through bottom
    if (playerY > 560) { playerY = 560; velY = 0; isJumping = false; }
    
    // Space charge system - count total presses (not consecutive), trigger boost at 10
    if (keys[' '] && playerY >= 560) {
        if (!lastSpacePressed) {
            spacePressCount++;
            lastSpacePressed = true;
            
            // Update charge bar
            const chargePercent = Math.min(100, (spacePressCount / 10) * 100);
            chargeBar.style.setProperty('--charge-width', chargePercent + '%');
            
            if (spacePressCount >= 10) {
                // Super jump at 10 total presses - send player flying
                velY = -28;  // Much higher velocity
                score += 250;
                updateScoreDisplay(score);
                makeScorePop(playerX + 20 - gameContainer.getBoundingClientRect().left, playerY - gameContainer.getBoundingClientRect().top, '+250 BOOST!');
                playBeep('collect');
                spacePressCount = 0;
                chargeBar.style.setProperty('--charge-width', '0%');
                isJumping = true;
            } else {
                // Regular jump with increased velocity per press
                velY = -(jumpPower + spacePressCount * 0.8);
                isJumping = true;
            }
        }
    } else {
        lastSpacePressed = false;
    }

    // tilt effect for visual feedback
    player.style.transform = `translateY(0) rotate(${Math.max(-10, Math.min(10, velX * 2.5))}deg)`;

    // Keep player in bounds with soft damping (dynamic width)
    let maxWidth = 360;
    if (gameStage === 2) maxWidth = 510;
        if (gameStage === 3) maxWidth = 800;
    if (playerX < 0) { playerX = 0; velX *= 0.6; }
    if (playerX > maxWidth) { playerX = maxWidth; velX *= 0.6; }
    // Move camera up as player gets higher
    let targetCameraOffset = Math.max(0, 600 - playerY);
    cameraOffset += (targetCameraOffset - cameraOffset) * 0.1;

    // Update player position
    player.style.left = playerX + 'px';
    player.style.bottom = (playerY - cameraOffset) + 'px';

    // get player's screen rect for collision & pass-over detection
    const playerRect = player.getBoundingClientRect();
    if (prevPlayerBottom === null) prevPlayerBottom = playerRect.bottom;

    // Update clouds
    clouds.forEach((cloud, index) => {
        cloud.update();
        if (cloud.y > playerY + 1000) {
            cloud.remove();
            clouds.splice(index, 1);
            return;
        }

        const cloudRect = cloud.element.getBoundingClientRect();

        // Check collision with player (screen-space)
        if (rectsIntersect(playerRect, cloudRect)) {
            cloud.pop();
            clouds.splice(index, 1);
            // Points scale with cloud size (smaller = fewer points, larger = more points)
            const points = Math.round(10 * cloud.sizeMultiplier);
            score += points;
            cloudsCollected++;
            updateScoreDisplay(score);
            makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, `+${points}`);
            playBeep('collect');
            return;
        }

        // Despawn cloud when player passes *above* it (player moves above the cloud on screen)
        if (prevPlayerBottom >= cloudRect.top && playerRect.bottom < cloudRect.top) {
            if (clouds[index]) {
                cloud.remove();
                clouds.splice(index, 1);
            }
        }
    });

    // Update dangers
    dangers.forEach((danger, index) => {
           const maxWidth = gameStage === 3 ? 800 : gameStage === 2 ? 550 : 400;
        danger.update(maxWidth);
        if (danger.y > playerY + 1000) {
            danger.remove();
            dangers.splice(index, 1);
            return;
        }

        const dangerRect = danger.element.getBoundingClientRect();
        if (rectsIntersect(playerRect, dangerRect)) {
            // God mode: ignore all damage
            if (godMode) {
                danger.remove();
                dangers.splice(index, 1);
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'INVINCIBLE!');
                return;
            }
            // Check if player has destroyer mode active
            if (destroyerMode && Date.now() < destroyerEndTime) {
                danger.remove();
                dangers.splice(index, 1);
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'DESTROYED!');
                playBeep('collect');
            } else if (hasShield) {
                // Check if player has shield
                hasShield = false;
                danger.remove();
                dangers.splice(index, 1);
                player.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'BLOCKED!');
                playBeep('collect');
            } else {
                // instant kill on touching danger without shield or destroyer mode
                danger.remove();
                dangers.splice(index, 1);
                health = 0;
                playBeep('death');
                endGame();
            }
        }
    });

    // Update planes (stage 3 only)
    planes.forEach((plane, index) => {
        const maxWidth = gameStage === 3 ? 750 : 550;
        plane.update(maxWidth);
        if (plane.y > playerY + 1000) {
            plane.remove();
            planes.splice(index, 1);
            return;
        }

        const planeRect = plane.element.getBoundingClientRect();
        if (rectsIntersect(playerRect, planeRect)) {
            // God mode: ignore all damage
            if (godMode) {
                plane.remove();
                planes.splice(index, 1);
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'INVINCIBLE!');
                return;
            }
            // Check if player has destroyer mode active
            if (destroyerMode && Date.now() < destroyerEndTime) {
                plane.remove();
                planes.splice(index, 1);
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'DESTROYED!');
                playBeep('collect');
            } else if (hasShield) {
                // Check if player has shield
                hasShield = false;
                plane.remove();
                planes.splice(index, 1);
                player.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'BLOCKED!');
                playBeep('collect');
            } else {
                // instant kill on touching plane without shield or destroyer mode
                plane.remove();
                planes.splice(index, 1);
                health = 0;
                playBeep('death');
                endGame();
            }
        }
    });

    // Update powerups
    powerups.forEach((powerup, index) => {
        powerup.update();
        if (powerup.y > playerY + 1000) {
            powerup.remove();
            powerups.splice(index, 1);
            return;
        }

        const powerupRect = powerup.element.getBoundingClientRect();
        if (rectsIntersect(playerRect, powerupRect)) {
            powerup.collect();
            powerups.splice(index, 1);
            
            if (powerup.type === 'shield') {
                hasShield = true;
                // Add visual indicator - glow effect on player
                player.style.filter = 'drop-shadow(0 0 8px #FFD700) drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'SHIELD!');
            } else if (powerup.type === 'destroyer') {
                destroyerMode = true;
                destroyerEndTime = Date.now() + 10000;  // 10 seconds
                // Add green glow effect on player
                player.style.filter = 'drop-shadow(0 0 10px #00FF00) drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'DESTROYER!');
            } else if (powerup.type === 'godmode') {
                godMode = true;
                // Add rainbow glow effect on player
                player.style.filter = 'drop-shadow(0 0 20px #FFFF00) drop-shadow(0 0 15px #FF00FF) drop-shadow(0 0 10px #0000FF) drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
                makeScorePop(playerRect.left + 20 - gameContainer.getBoundingClientRect().left, playerRect.top - gameContainer.getBoundingClientRect().top, 'GOD MODE!');
            }
            playBeep('collect');
            return;
        }
    });

    // Check if score reached 400 to trigger stage 2
    if (score >= 400 && !stageTriggered) {
        stageTriggered = true;
        gameStage = 2;
        // Widen game container
        gameContainer.style.width = '550px';
        // Update player bounds
        player.style.left = Math.min(playerX, 510) + 'px';
        // Adjust danger spawn bounds
    }

    // Check if score reached 800 to trigger stage 3
    if (score >= 800 && gameStage === 2) {
        gameStage = 3;
        // Widen game container further
        gameContainer.style.width = '750px';
            gameContainer.style.width = '800px';
           player.style.left = Math.min(playerX, 760) + 'px';
        player.style.left = Math.min(playerX, 710) + 'px';
    }

    // Apply wider bounds at stage 2
    // Check if destroyer mode expired
    if (destroyerMode && Date.now() >= destroyerEndTime) {
        destroyerMode = false;
        player.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))';
    }

    // store previous playerX for next frame (used to detect passing over clouds)
    prevPlayerX = playerX;
    // store previous player bottom for vertical pass detection
    prevPlayerBottom = playerRect.bottom;

    // Gradually increase difficulty (spawn more dangers but at reduced rates)
    if (score > 100 && Math.random() < 0.08) {
        spawnDanger();
    } else if (score > 200 && Math.random() < 0.15) {
        spawnDanger();
    } else if (score > 300 && Math.random() < 0.22) {
        spawnDanger();
    }
}

// End game
function endGame() {
    gameActive = false;
    showGameOver(score, cloudsCollected);
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Setup
initInput(gameContainer);

// Spawn timers - dynamic based on game stage
const cloudSpawnTimer = setInterval(() => { 
    const maxClouds = gameStage === 2 ? 20 : 14;
    if (clouds.length < maxClouds) spawnCloud(); 
}, 1200);

const dangerSpawnTimer = setInterval(() => { 
    const maxDangers = gameStage === 2 ? 8 : 5;
        const baseProbability = gameStage === 2 ? 0.162 : 0.09;
    if (dangers.length < maxDangers && Math.random() < Math.min(0.55, baseProbability + score / 600)) spawnDanger(); 
}, 1500);

const powerupSpawnTimer = setInterval(() => { 
    if (powerups.length < 1 && Math.random() < 0.1) spawnPowerup(); 
}, 2000);

const planeSpawnTimer = setInterval(() => { 
    const maxPlanes = score >= 10000 ? 12 : (gameStage === 3 ? 4 : 0);
    if (planes.length < maxPlanes && gameStage === 3 && Math.random() < 0.08) spawnPlane(); 
}, 1200);

// Spawn initial clouds
for (let i = 0; i < 6; i++) clouds.push(new Cloud(gameContainer, getCameraOffset));

// Play again handler (reload for now)
export function restartGame() {
    window.location.reload();
}
setPlayAgainHandler(restartGame);

// Start loops
gameLoop();