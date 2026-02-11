const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const instructionsElement = document.getElementById('instructions');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let distance = 0;
let isGameOver = false;

const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 60,
    color: '#ffcc00',
    stamina: 100,
    progress: 0,
    state: 'walking', // walking, swimming, jumping, climbing
    velocityY: 0,
    isJumping: false,
    lastJumpTime: 0
};

const terrain = [];
const TERRAIN_TYPES = {
    GROUND: 'ground',
    WATER: 'water',
    HOLE: 'hole',
    MOUNTAIN: 'mountain'
};

const colors = {
    ground: '#5c4033',
    grass: '#2e8b57',
    water: 'rgba(0, 105, 148, 0.7)',
    hole: '#1a1a1a',
    mountain: '#696969',
    mountainCap: '#ffffff'
};

// Generate initial terrain
function generateTerrain(startX) {
    let currentX = startX;
    while (currentX < startX + canvas.width * 2) {
        let type;
        let width;
        
        const rand = Math.random();
        if (score < 100) {
            type = TERRAIN_TYPES.GROUND;
            width = 400 + Math.random() * 400;
        } else if (score > 1000 && score < 2000) {
           // Mountain phase
           type = TERRAIN_TYPES.MOUNTAIN;
           width = 1000;
        } else {
            if (rand < 0.6) {
                type = TERRAIN_TYPES.GROUND;
                width = 200 + Math.random() * 300;
            } else if (rand < 0.8) {
                type = TERRAIN_TYPES.WATER;
                width = 100 + Math.random() * 200;
            } else {
                type = TERRAIN_TYPES.HOLE;
                width = 80 + Math.random() * 100;
            }
        }

        terrain.push({
            x: currentX,
            width: width,
            type: type
        });
        currentX += width;
    }
}

generateTerrain(0);

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    handleSpam(e.key.toLowerCase());
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

let lastSpamKey = null;
function handleSpam(key) {
    if (isGameOver) return;

    if (player.state === 'swimming' && key === ' ') {
        player.progress += 10;
    } else if (key === 'z') {
        const currentTime = Date.now();
        if (currentTime - player.lastJumpTime > 250) { // 0.25 second cooldown
            player.velocityY = -13;
            player.isJumping = true;
            player.lastJumpTime = currentTime;
        }
    } else if (player.state === 'climbing') {
        if ((key === 'e' && lastSpamKey !== 'e') || (key === 'f' && lastSpamKey !== 'f')) {
            player.progress += 4;
            lastSpamKey = key;
        }
    }
}

function update() {
    if (isGameOver) return;

    // Handle Jumping Gravity
    if (player.isJumping) {
        player.y += player.velocityY;
        player.velocityY += 0.7; // Gravity
        
        if (player.y >= 300) {
            player.y = 300;
            player.isJumping = false;
            player.velocityY = 0;
        }
    }

    // Movement speed increases with score
    const speed = 3 + Math.min(score / 500, 5);
    
    // Find current terrain
    const currentTerrain = terrain.find(t => player.x >= t.x && player.x < t.x + t.width);
    
    if (currentTerrain) {
        if (currentTerrain.type === TERRAIN_TYPES.GROUND) {
            player.state = 'walking';
            player.progress = 0;
            distance += speed;
            instructionsElement.innerText = "Walk safely...";
        } else if (currentTerrain.type === TERRAIN_TYPES.WATER) {
            player.state = 'swimming';
            instructionsElement.innerText = "SPAM SPACE TO SWIM!";
            player.progress -= 0.5;
            if (player.progress < 0) player.progress = 0;
            
            distance += player.progress > 0 ? 2 : 0.5;
            player.progress *= 0.95;
        } else if (currentTerrain.type === TERRAIN_TYPES.HOLE) {
            instructionsElement.innerText = "PRESS Z TO JUMP!";
            // If they aren't jumping and they are over a hole, they fall
            if (!player.isJumping && player.y >= 300) {
                gameOver();
            }
            distance += speed;
        } else if (currentTerrain.type === TERRAIN_TYPES.MOUNTAIN) {
            player.state = 'climbing';
            instructionsElement.innerText = "SPAM E AND F TO CLIMB!";
            player.progress -= 0.3;
            if (player.progress < 0) player.progress = 0;
            
            distance += player.progress > 0 ? 1 : 0;
            player.progress *= 0.98;
        }
    }

    score = Math.floor(distance / 10);
    scoreElement.innerText = `Score: ${score}`;

    // Move everything else
    const offset = speed;
    terrain.forEach(t => t.x -= offset);
    
    // Generate more terrain if needed
    if (terrain[terrain.length - 1].x < canvas.width + 500) {
        generateTerrain(terrain[terrain.length - 1].x + terrain[terrain.length - 1].width);
    }

    // Clean up old terrain
    if (terrain[0].x + terrain[0].width < -100) {
        terrain.shift();
    }
    
    // Special case for mountain at score 1000
    if (score >= 1000 && score < 1010 && !terrain.some(t => t.type === TERRAIN_TYPES.MOUNTAIN)) {
        // Force a mountain
        terrain.push({
            x: canvas.width + 100,
            width: 10000, // 1000 score long (10 units per score)
            type: TERRAIN_TYPES.MOUNTAIN
        });
    }
}

function gameOver() {
    isGameOver = true;
    gameOverElement.style.display = 'block';
    finalScoreElement.innerText = `Final Score: ${score}`;
}

function draw() {
    // Beautiful Sky Gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#1e3c72');
    skyGradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw terrain
    terrain.forEach(t => {
        if (t.type === TERRAIN_TYPES.GROUND) {
            ctx.fillStyle = colors.ground;
            ctx.fillRect(t.x, 360, t.width, 40);
            ctx.fillStyle = colors.grass;
            ctx.fillRect(t.x, 360, t.width, 10);
        } else if (t.type === TERRAIN_TYPES.WATER) {
            ctx.fillStyle = colors.water;
            ctx.fillRect(t.x, 340, t.width, 60);
            // Ripple effect
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.moveTo(t.x, 345 + Math.sin(Date.now()/300 + t.x/20)*5);
            ctx.lineTo(t.x + t.width, 345 + Math.sin(Date.now()/300 + (t.x + t.width)/20)*5);
            ctx.stroke();
        } else if (t.type === TERRAIN_TYPES.HOLE) {
            ctx.fillStyle = colors.hole;
            ctx.fillRect(t.x, 360, t.width, 40);
        } else if (t.type === TERRAIN_TYPES.MOUNTAIN) {
            ctx.fillStyle = colors.mountain;
            ctx.beginPath();
            ctx.moveTo(t.x, 360);
            ctx.lineTo(t.x + t.width/2, 60);
            ctx.lineTo(t.x + t.width, 360);
            ctx.fill();
            
            // Snow Cap
            ctx.fillStyle = colors.mountainCap;
            ctx.beginPath();
            ctx.moveTo(t.x + t.width/2 - 30, 110);
            ctx.lineTo(t.x + t.width/2, 60);
            ctx.lineTo(t.x + t.width/2 + 30, 110);
            ctx.fill();
        }
    });

    // Draw player with detail
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'black';
    ctx.fillStyle = player.color;
    
    let playerDisplayY = player.y;
    if (player.state === 'climbing') {
        playerDisplayY = 300 - (player.progress * 2);
    } else if (player.state === 'swimming') {
        playerDisplayY = Math.max(player.y, 320);
    }
    
    ctx.fillRect(player.x, playerDisplayY, player.width, player.height);
    
    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 25, playerDisplayY + 12, 6, 6);
    ctx.shadowBlur = 0;

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

draw();
