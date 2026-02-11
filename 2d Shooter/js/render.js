// Rendering and fog of war
const visibilityRadius = 50;

// Draw fog of war effect
function drawFogOfWar(ctx, canvasWidth, canvasHeight) {
    const gradient = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, visibilityRadius);
    gradient.addColorStop(1, 'rgba(150, 150, 150, 0.6)');
    
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(60, 60, 60, 0.6)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, visibilityRadius, 25, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Main render function
function render(ctx, canvasWidth, canvasHeight) {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw game objects
    drawTrash(ctx, visibilityRadius);
    drawZombies(ctx, visibilityRadius);
    drawGhosts(ctx, visibilityRadius);
    drawBullets(ctx, visibilityRadius);
    drawPlayer(ctx);

    // Apply fog of war
    drawFogOfWar(ctx, canvasWidth, canvasHeight);
}
