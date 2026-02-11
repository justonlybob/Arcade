class Enemy {
    constructor(health, speed) {
        this.health = health;
        this.speed = speed;
        this.position = { x: 0, y: 0 }; // Starting position
    }

    moveTowards(target) {
        // Logic to move towards the target (player's base)
        const directionX = target.x - this.position.x;
        const directionY = target.y - this.position.y;
        const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

        if (distance > 0) {
            this.position.x += (directionX / distance) * this.speed;
            this.position.y += (directionY / distance) * this.speed;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.onDeath();
        }
    }

    onDeath() {
        // Logic for when the enemy dies (e.g., increase player's money)
    }
}