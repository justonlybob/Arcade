// ===== GHOST CONSTANTS =====
const GHOST_CONFIG = {
    BASE_RADIUS: 14,
    BASE_SPEED: 0.7,
    SPEED_VARIANCE: 0.3,
    BASE_HEALTH: 3,
    COLOR: '#00ffff',
    GLOW_DISTANCE: 120,
    VISIBILITY_DISTANCE: 170,
    MIN_ALPHA: 0.15,
    SPAWN_INTERVAL: 1500,
    DAMAGE_ON_COLLISION: 2,
    SPAWN_CHANCE: 0.15  // 15% chance to spawn a ghost instead of zombie
};

// Ghosts array
let ghosts = [];

// Initialize ghosts
function initGhosts() {
    ghosts = [];
}

function allGhostsDead() {
    return ghosts.length === 0;
}

// Spawn a single ghost
function spawnGhost(canvasWidth, canvasHeight) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    const padding = 20;
    
    switch(side) {
        case 0: x = Math.random() * canvasWidth; y = -padding; break;
        case 1: x = canvasWidth + padding; y = Math.random() * canvasHeight; break;
        case 2: x = Math.random() * canvasWidth; y = canvasHeight + padding; break;
        case 3: x = -padding; y = Math.random() * canvasHeight; break;
    }

    const speedMultiplier = 1 + (wave * 0.1);
    const healthMultiplier = 1 + Math.floor(wave / 3);
    
    ghosts.push({
        x: x,
        y: y,
        radius: GHOST_CONFIG.BASE_RADIUS,
        speed: (GHOST_CONFIG.BASE_SPEED + Math.random() * GHOST_CONFIG.SPEED_VARIANCE) * speedMultiplier,
        health: GHOST_CONFIG.BASE_HEALTH + healthMultiplier,
        maxHealth: GHOST_CONFIG.BASE_HEALTH + healthMultiplier,
        color: GHOST_CONFIG.COLOR,
        wave: wave,
        wobblePhase: Math.random() * Math.PI * 2
    });
}

// Update ghosts
function updateGhosts() {
    ghosts.forEach(ghost => {
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            ghost.x += (dx / dist) * ghost.speed;
            ghost.y += (dy / dist) * ghost.speed;
        }
    });
}

// Draw ghosts with spectral visuals
function drawGhosts(ctx, visibilityRadius) {
    ghosts.forEach(ghost => {
        const dx = ghost.x - player.x;
        const dy = ghost.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < GHOST_CONFIG.VISIBILITY_DISTANCE) {
            ctx.save();
            ctx.globalAlpha = Math.max(GHOST_CONFIG.MIN_ALPHA, 1 - (dist / GHOST_CONFIG.VISIBILITY_DISTANCE));
            
            const time = Date.now() * 0.001;
            const healthPercent = ghost.health / ghost.maxHealth;
            const wobble = Math.sin(time * 2 + ghost.wobblePhase) * 2;
            const floatBob = Math.cos(time * 1.5 + ghost.wobblePhase) * 3;
            
            // Spectral glow effect
            if (dist < GHOST_CONFIG.GLOW_DISTANCE) {
                const glowIntensity = 1 - (dist / GHOST_CONFIG.GLOW_DISTANCE);
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 35 * glowIntensity;
                ctx.shadowOffsetX = wobble;
                ctx.shadowOffsetY = floatBob;
            }
            
            // Main body with cyan gradient (ghostly)
            const bodyGradient = ctx.createRadialGradient(ghost.x, ghost.y - floatBob, 0, ghost.x, ghost.y - floatBob, ghost.radius);
            bodyGradient.addColorStop(0, '#66ffff');
            bodyGradient.addColorStop(0.5, '#00ffff');
            bodyGradient.addColorStop(1, '#0099cc');
            
            ctx.fillStyle = bodyGradient;
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Wispy aura (semi-transparent rings)
            ctx.strokeStyle = '#00ffff';
            ctx.globalAlpha *= 0.5;
            ctx.lineWidth = 1.5;
            for (let i = 1; i <= 3; i++) {
                const ringSize = ghost.radius + (i * 4) + Math.sin(time * 3 + i) * 2;
                ctx.beginPath();
                ctx.arc(ghost.x, ghost.y, ringSize, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = Math.max(GHOST_CONFIG.MIN_ALPHA, 1 - (dist / GHOST_CONFIG.VISIBILITY_DISTANCE));
            
            // Border ring
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, ghost.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Health bar (cyan arc style)
            const healthColor = healthPercent > 0.66 ? '#00ff00' : 
                               healthPercent > 0.33 ? '#ffff00' : '#ff0000';
            ctx.strokeStyle = healthColor;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, ghost.radius + 5, 0, Math.PI * 2 * healthPercent);
            ctx.stroke();
            
            // Haunting eyes (glowing orbs)
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 10;
            const eyeOffsetX = Math.cos(time * 2.5) * 0.5;
            const eyeOffsetY = Math.sin(time * 2) * 0.5;
            
            ctx.beginPath();
            ctx.arc(ghost.x - 5 + eyeOffsetX, ghost.y - 4 + eyeOffsetY, 2.5, 0, Math.PI * 2);
            ctx.arc(ghost.x + 5 + eyeOffsetX, ghost.y - 4 + eyeOffsetY, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils (cyan for ghostly effect)
            ctx.fillStyle = '#00ffff';
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(ghost.x - 5 + eyeOffsetX, ghost.y - 4 + eyeOffsetY, 1.2, 0, Math.PI * 2);
            ctx.arc(ghost.x + 5 + eyeOffsetX, ghost.y - 4 + eyeOffsetY, 1.2, 0, Math.PI * 2);
            ctx.fill();
            
            // Mouth (mysterious O)
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y + 3, 3, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
    });
}

// Check if all ghosts are dead
function allGhostsDead() {
    return ghosts.length === 0;
}

// Get ghost count
function getGhostCount() {
    return ghosts.length;
}

// Get total enemies
function getTotalEnemies() {
    return zombies.length + ghosts.length;
}
