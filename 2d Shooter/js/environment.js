// ===== ENVIRONMENT CONSTANTS =====
const ENVIRONMENT_CONFIG = {
    TRASH_COUNT: 50,
    TRASH_TYPES: 4,
    MIN_SIZE: 10,
    MAX_SIZE: 20,
    REVEAL_DISTANCE: 80,
    COLORS: ['#8B4513', '#666666', '#556B2F', '#654321']
};

// Trash yard environment
let trashItems = [];

// Initialize trash yard
function initTrashYard(canvasWidth, canvasHeight) {
    trashItems = [];
    for (let i = 0; i < ENVIRONMENT_CONFIG.TRASH_COUNT; i++) {
        trashItems.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            type: Math.floor(Math.random() * ENVIRONMENT_CONFIG.TRASH_TYPES),
            size: ENVIRONMENT_CONFIG.MIN_SIZE + Math.random() * (ENVIRONMENT_CONFIG.MAX_SIZE - ENVIRONMENT_CONFIG.MIN_SIZE),
            rotation: Math.random() * Math.PI * 2,
            color: ENVIRONMENT_CONFIG.COLORS[Math.floor(Math.random() * ENVIRONMENT_CONFIG.COLORS.length)]
        });
    }
}

// Draw trash with improved visuals
function drawTrash(ctx, visibilityRadius) {
    trashItems.forEach(item => {
        const dx = item.x - player.x;
        const dy = item.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < visibilityRadius) {
            ctx.save();
            ctx.translate(item.x, item.y);
            ctx.rotate(item.rotation);
            
            let alpha;
            if (dist < ENVIRONMENT_CONFIG.REVEAL_DISTANCE) {
                alpha = 1;
            } else {
                alpha = 1 - ((dist - ENVIRONMENT_CONFIG.REVEAL_DISTANCE) / (visibilityRadius - ENVIRONMENT_CONFIG.REVEAL_DISTANCE));
            }
            ctx.globalAlpha = alpha;
            ctx.fillStyle = item.color;
            ctx.fillRect(-item.size/2, -item.size/2, item.size, item.size);
            
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(-item.size/2, -item.size/2, item.size, item.size);
            
            ctx.restore();
        }
    });
}
