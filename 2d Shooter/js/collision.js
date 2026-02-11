// ===== COLLISION CONSTANTS =====
const COLLISION_CONFIG = {
    INVULNERABILITY_FRAMES: 60,
    DAMAGE_PER_HIT: 1
};

// Collision detection and handling - optimized

// Check and handle player-zombie collisions
function checkPlayerZombieCollisions() {
    if (player.invulnerable) return;
    
    for (let i = 0; i < zombies.length; i++) {
        const zombie = zombies[i];
        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;
        const distSq = dx * dx + dy * dy;
        const minDistSq = (player.radius + zombie.radius) ** 2;

        if (distSq < minDistSq) {
            player.lives -= COLLISION_CONFIG.DAMAGE_PER_HIT;
            player.invulnerable = true;
            player.invulnerableTime = COLLISION_CONFIG.INVULNERABILITY_FRAMES;
            updateUI();
            
            if (player.lives <= 0) {
                endGame();
            }
            break;
        }
    }
}

// Check and handle player-ghost collisions (2 damage)
function checkPlayerGhostCollisions() {
    if (player.invulnerable) return;
    
    for (let i = 0; i < ghosts.length; i++) {
        const ghost = ghosts[i];
        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        const distSq = dx * dx + dy * dy;
        const minDistSq = (player.radius + ghost.radius) ** 2;

        if (distSq < minDistSq) {
            player.lives -= GHOST_CONFIG.DAMAGE_ON_COLLISION;
            player.invulnerable = true;
            player.invulnerableTime = COLLISION_CONFIG.INVULNERABILITY_FRAMES;
            updateUI();
            
            if (player.lives <= 0) {
                endGame();
            }
            break;
        }
    }
}

// Check and handle bullet-zombie collisions - optimized
function checkBulletZombieCollisions() {
    for (let bulletIdx = bullets.length - 1; bulletIdx >= 0; bulletIdx--) {
        const bullet = bullets[bulletIdx];
        let bulletHit = false;
        
        for (let zombieIdx = zombies.length - 1; zombieIdx >= 0; zombieIdx--) {
            const zombie = zombies[zombieIdx];
            const dx = bullet.x - zombie.x;
            const dy = bullet.y - zombie.y;
            const distSq = dx * dx + dy * dy;
            const minDistSq = (bullet.radius + zombie.radius) ** 2;

            if (distSq < minDistSq) {
                zombie.health--;
                bulletHit = true;
                
                if (zombie.health <= 0) {
                    zombies.splice(zombieIdx, 1);
                    incrementScore();
                    trackZombieKilled();
                }
                break;
            }
        }
        
        if (bulletHit) {
            bullets.splice(bulletIdx, 1);
        }
    }
}

// Check and handle bullet-ghost collisions
function checkBulletGhostCollisions() {
    for (let bulletIdx = bullets.length - 1; bulletIdx >= 0; bulletIdx--) {
        const bullet = bullets[bulletIdx];
        let bulletHit = false;
        
        for (let ghostIdx = ghosts.length - 1; ghostIdx >= 0; ghostIdx--) {
            const ghost = ghosts[ghostIdx];
            const dx = bullet.x - ghost.x;
            const dy = bullet.y - ghost.y;
            const distSq = dx * dx + dy * dy;
            const minDistSq = (bullet.radius + ghost.radius) ** 2;

            if (distSq < minDistSq) {
                ghost.health--;
                bulletHit = true;
                
                if (ghost.health <= 0) {
                    ghosts.splice(ghostIdx, 1);
                    incrementScore(2);  // Ghosts worth 2x points
                }
                break;
            }
        }
        
        if (bulletHit && bulletIdx < bullets.length) {
            bullets.splice(bulletIdx, 1);
        }
    }
}

// Check all collisions
function checkAllCollisions() {
    checkPlayerZombieCollisions();
    checkPlayerGhostCollisions();
    checkBulletZombieCollisions();
    checkBulletGhostCollisions();
}
