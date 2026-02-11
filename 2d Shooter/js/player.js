// ===== PLAYER CONSTANTS =====
const PLAYER_CONFIG = {
    INITIAL_RADIUS: 15,
    INITIAL_SPEED: 4,
    INITIAL_LIVES: 3,
    COLOR: '#00ff00',
    INVULNERABILITY_DURATION: 60,
    DIRECTION_LINE_LENGTH: 20
};

// Player object
const player = {
    x: 400,
    y: 300,
    radius: PLAYER_CONFIG.INITIAL_RADIUS,
    speed: PLAYER_CONFIG.INITIAL_SPEED,
    lives: PLAYER_CONFIG.INITIAL_LIVES,
    color: PLAYER_CONFIG.COLOR,
    invulnerable: false,
    invulnerableTime: 0,
    isMoving: false
};

// Input
const keys = {};
const mouse = { x: 0, y: 0, clicked: false };

// Initialize player
function initPlayer(canvasWidth, canvasHeight) {
    player.x = canvasWidth / 2;
    player.y = canvasHeight / 2;
    player.lives = PLAYER_CONFIG.INITIAL_LIVES;
    player.invulnerable = false;
    player.invulnerableTime = 0;
    player.isMoving = false;
}

// Update player with optimized movement
function updatePlayer() {
    const movementX = (keys['d'] || keys['arrowright'] ? 1 : 0) + (keys['a'] || keys['arrowleft'] ? -1 : 0);
    const movementY = (keys['s'] || keys['arrowdown'] ? 1 : 0) + (keys['w'] || keys['arrowup'] ? -1 : 0);
    
    player.isMoving = movementX !== 0 || movementY !== 0;
    
    if (movementX !== 0) player.x += movementX * player.speed;
    if (movementY !== 0) player.y += movementY * player.speed;

    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Update invulnerability
    if (player.invulnerable) {
        player.invulnerableTime--;
        if (player.invulnerableTime <= 0) {
            player.invulnerable = false;
        }
    }
}

// Draw player with improved visuals
function drawPlayer(ctx) {
    const shouldFlash = player.invulnerable && Math.floor(Date.now() / 100) % 2 === 0;
    const time = Date.now() * 0.001;
    
    // Glow effect
    ctx.shadowColor = shouldFlash ? '#ffffff' : '#00ff00';
    ctx.shadowBlur = 20 + Math.sin(time) * 5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Main body with gradient
    const gradient = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, player.radius);
    gradient.addColorStop(0, shouldFlash ? '#ffffff' : '#00ff00');
    gradient.addColorStop(0.7, shouldFlash ? '#ffffff' : '#00cc00');
    gradient.addColorStop(1, shouldFlash ? '#cccccc' : '#009900');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer ring with pulsing effect
    ctx.shadowBlur = 0;
    ctx.strokeStyle = shouldFlash ? '#ffff00' : '#00ff00';
    ctx.lineWidth = 2 + Math.sin(time * 3) * 0.5;
    ctx.stroke();
    
    // Inner detail circle
    ctx.strokeStyle = shouldFlash ? '#ffffff' : '#00dd00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    
    // Dynamic spikes (4 points around the player)
    const spikeLength = player.radius * 0.8;
    const spikeCount = 4;
    for (let i = 0; i < spikeCount; i++) {
        const spikeAngle = (i / spikeCount) * Math.PI * 2 + time;
        const spikeX = player.x + Math.cos(spikeAngle) * (player.radius + spikeLength);
        const spikeY = player.y + Math.sin(spikeAngle) * (player.radius + spikeLength);
        
        ctx.shadowColor = shouldFlash ? '#ffff00' : '#00ff00';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = shouldFlash ? '#ffff00' : '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x + Math.cos(spikeAngle) * player.radius, 
                   player.y + Math.sin(spikeAngle) * player.radius);
        ctx.lineTo(spikeX, spikeY);
        ctx.stroke();
    }
    
    // Direction indicator (arrow style)
    ctx.shadowBlur = 0;
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const arrowLength = PLAYER_CONFIG.DIRECTION_LINE_LENGTH;
    const arrowX = player.x + Math.cos(angle) * arrowLength;
    const arrowY = player.y + Math.sin(angle) * arrowLength;
    
    ctx.strokeStyle = '#ffff00';
    ctx.fillStyle = '#ffff00';
    ctx.lineWidth = 2;
    
    // Arrow line
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(arrowX, arrowY);
    ctx.stroke();
    
    // Arrow head
    const arrowSize = 8;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - Math.cos(angle - Math.PI / 6) * arrowSize, 
               arrowY - Math.sin(angle - Math.PI / 6) * arrowSize);
    ctx.lineTo(arrowX - Math.cos(angle + Math.PI / 6) * arrowSize, 
               arrowY - Math.sin(angle + Math.PI / 6) * arrowSize);
    ctx.closePath();
    ctx.fill();
}

// Setup input listeners
function setupPlayerControls(canvas) {
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            keys[key] = true;
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
}
