// ===== BULLET CONSTANTS =====
const BULLET_CONFIG = {
    SPEED: 8,
    RADIUS: 4,
    COLOR: '#ffff00',
    MAX_DISTANCE: 1000,
    MAX_BULLETS: 50
};

// Bullets array
let bullets = [];
let bulletsFired = 0;

// Initialize bullets
function initBullets() {
    bullets = [];
    bulletsFired = 0;
}

// Shoot a bullet
function shootBullet() {
    if (bullets.length >= BULLET_CONFIG.MAX_BULLETS) return;
    
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const speed = BULLET_CONFIG.SPEED + (wave * 0.1);
    
    bullets.push({
        x: player.x + Math.cos(angle) * (player.radius + 5),
        y: player.y + Math.sin(angle) * (player.radius + 5),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: BULLET_CONFIG.RADIUS,
        color: BULLET_CONFIG.COLOR,
        maxDistance: BULLET_CONFIG.MAX_DISTANCE,
        distanceTraveled: 0
    });
    bulletsFired++;
}

// Update bullets
function updateBullets(canvasWidth, canvasHeight) {
    bullets = bullets.filter(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.distanceTraveled += Math.abs(bullet.vx) + Math.abs(bullet.vy);
        return bullet.distanceTraveled < bullet.maxDistance;
    });
}

// Draw bullets with improved visuals
function drawBullets(ctx, visibilityRadius) {
    const bulletVisibilityRadius = 100;
    
    bullets.forEach(bullet => {
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < bulletVisibilityRadius) {
            ctx.save();
            ctx.globalAlpha = Math.max(0.3, 1 - (dist / bulletVisibilityRadius));
            ctx.fillStyle = bullet.color;
            ctx.shadowColor = '#ffff00';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });
}

// Get bullet count
function getBulletCount() {
    return bullets.length;
}
