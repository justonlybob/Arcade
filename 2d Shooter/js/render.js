// Rendering and fog of war
const visibilityRadius = 50;

// Draw fog of war effect
function drawFogOfWar(ctx, canvasWidth, canvasHeight) {
    const gradient = ctx.createRadialGradient(player.x, player.y, 0, player.x, player.y, visibilityRadius * 4); // Increased radius for better gameplay
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'; // Darker, moodier fog
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, visibilityRadius * 4, 0, Math.PI * 2); // Corrected start angle from 25 to 0
    ctx.fill();
    ctx.restore();
}

// Main render function
function render(ctx, canvasWidth, canvasHeight) {
    // Clear canvas
    ctx.fillStyle = '#2a2a2a'; // Brighter background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw game objects
    drawTrash(ctx, visibilityRadius);
    drawZombies(ctx, visibilityRadius);
    drawGhosts(ctx, visibilityRadius);
    drawBullets(ctx, visibilityRadius);
    drawPlayer(ctx);

    // Apply fog of war (Skipped or lightened to make everything brighter)
    // drawFogOfWar(ctx, canvasWidth, canvasHeight); 
}
