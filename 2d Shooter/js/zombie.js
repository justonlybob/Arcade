// ===== ZOMBIE CONSTANTS =====
const ZOMBIE_CONFIG = {
    BASE_RADIUS: 12,
    BASE_SPEED: 0.5,
    SPEED_VARIANCE: 0.5,
    BASE_HEALTH: 2,
    COLOR: '#ff0000',
    GLOW_DISTANCE: 100,
    VISIBILITY_DISTANCE: 150,
    MIN_ALPHA: 0.2,
    SPAWN_INTERVAL: 1000
};

// Zombies array
let zombies = [];
let currentWave = 1; // Renamed from 'wave' to avoid confusion with wave logic
let zombiesKilled = 0;

// Initialize zombies
function initZombies() {
    zombies = [];
    currentWave = 1;
    zombiesKilled = 0;
}

// Spawn a single zombie
function spawnZombie(canvasWidth, canvasHeight) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    const padding = 20;
    
    switch(side) {
        case 0: x = Math.random() * canvasWidth; y = -padding; break;
        case 1: x = canvasWidth + padding; y = Math.random() * canvasHeight; break;
        case 2: x = Math.random() * canvasWidth; y = canvasHeight + padding; break;
        case 3: x = -padding; y = Math.random() * canvasHeight; break;
    }

    const speedMultiplier = 1 + (currentWave * 0.15);
    const healthMultiplier = 1 + Math.floor(currentWave / 2);
    
    zombies.push({
        x: x,
        y: y,
        radius: ZOMBIE_CONFIG.BASE_RADIUS,
        speed: (ZOMBIE_CONFIG.BASE_SPEED + Math.random() * ZOMBIE_CONFIG.SPEED_VARIANCE) * speedMultiplier,
        health: ZOMBIE_CONFIG.BASE_HEALTH + healthMultiplier,
        maxHealth: ZOMBIE_CONFIG.BASE_HEALTH + healthMultiplier,
        color: ZOMBIE_CONFIG.COLOR,
        wave: currentWave
    });
}

// Spawn a wave of zombies
function spawnWave(canvasWidth, canvasHeight) {
    const zombieCount = 5 + (currentWave * 2);
    for (let i = 0; i < zombieCount; i++) {
        setTimeout(() => {
            if (gameRunning) {
                // Occasionally spawn a ghost instead of a zombie
                if (Math.random() < GHOST_CONFIG.SPAWN_CHANCE) {
                    spawnGhost(canvasWidth, canvasHeight);
                } else {
                    spawnZombie(canvasWidth, canvasHeight);
                }
            }
        }, i * ZOMBIE_CONFIG.SPAWN_INTERVAL);
    }
}

// Update zombies
function updateZombies() {
    zombies.forEach(zombie => {
        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            zombie.x += (dx / dist) * zombie.speed;
            zombie.y += (dy / dist) * zombie.speed;
        }
    });
}

// Draw zombies with improved visuals
function drawZombies(ctx, visibilityRadius) {
    zombies.forEach(zombie => {
        const dx = zombie.x - player.x;
        const dy = zombie.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Remove distance check to make them always visible and bright
        ctx.save();
        ctx.globalAlpha = 1.0; // Full brightness
        
        const time = Date.now() * 0.001;
        const healthPercent = zombie.health / zombie.maxHealth;
        const wobble = Math.sin(time * 3 + zombie.x) * 1.5;
        
        // Enhanced glow
        ctx.shadowColor = healthPercent > 0.5 ? '#ff3333' : '#ff6600';
        ctx.shadowBlur = 15; // Consistent glow
        ctx.shadowOffsetX = wobble;
        ctx.shadowOffsetY = wobble;
        
        // Main body with brighter gradient
        const bodyGradient = ctx.createRadialGradient(zombie.x, zombie.y, 0, zombie.x, zombie.y, zombie.radius);
        bodyGradient.addColorStop(0, '#ff6666');
        bodyGradient.addColorStop(0.6, '#ff0000');
        bodyGradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Outer jagged ring (menacing spikes)
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        const spikeCount = 8;
        for (let i = 0; i < spikeCount; i++) {
            const angle = (i / spikeCount) * Math.PI * 2;
            const spikeLength = zombie.radius * 0.4 + Math.sin(time * 4 + i) * 2;
            const x1 = zombie.x + Math.cos(angle) * zombie.radius;
            const y1 = zombie.y + Math.sin(angle) * zombie.radius;
            const x2 = zombie.x + Math.cos(angle) * (zombie.radius + spikeLength);
            const y2 = zombie.y + Math.sin(angle) * (zombie.radius + spikeLength);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Border ring
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Health bar (arc style)
        const healthColor = healthPercent > 0.66 ? '#00ff00' : 
                           healthPercent > 0.33 ? '#ffff00' : '#ff0000';
        ctx.strokeStyle = healthColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y, zombie.radius + 4, 0, Math.PI * 2 * healthPercent);
        ctx.stroke();
        
        // Menacing eyes with glow
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 8;
        const eyeOffsetX = Math.cos(time * 2) * 1;
        const eyeOffsetY = Math.sin(time * 2.5) * 1;
        
        ctx.beginPath();
        ctx.arc(zombie.x - 5 + eyeOffsetX, zombie.y - 4 + eyeOffsetY, 2.5, 0, Math.PI * 2);
        ctx.arc(zombie.x + 5 + eyeOffsetX, zombie.y - 4 + eyeOffsetY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils (red for menace)
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(zombie.x - 5 + eyeOffsetX, zombie.y - 4 + eyeOffsetY, 1.2, 0, Math.PI * 2);
        ctx.arc(zombie.x + 5 + eyeOffsetX, zombie.y - 4 + eyeOffsetY, 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (menacing grin)
        ctx.strokeStyle = '#cc0000';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(zombie.x, zombie.y + 3, 4, 0, Math.PI, false);
        ctx.stroke();
        
        ctx.restore();
    });
}

// Get current wave
function getCurrentWave() {
    return currentWave;
}

// Increment wave
function nextWave() {
    currentWave++;
}

// Check if all zombies are dead
function allZombiesDead() {
    return zombies.length === 0;
}

// Get zombie count
function getZombieCount() {
    return zombies.length;
}

// Track killed zombies
function trackZombieKilled() {
    zombiesKilled++;
}
