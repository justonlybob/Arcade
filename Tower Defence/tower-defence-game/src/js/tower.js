class Tower {
    constructor(cost, damage, range) {
        this.cost = cost;
        this.damage = damage;
        this.range = range;
        this.isActive = true;
    }

    attack(enemy) {
        if (this.isActive && this.inRange(enemy)) {
            enemy.takeDamage(this.damage);
        }
    }

    inRange(enemy) {
        // Calculate distance to the enemy
        const distance = Math.sqrt(
            Math.pow(this.position.x - enemy.position.x, 2) +
            Math.pow(this.position.y - enemy.position.y, 2)
        );
        return distance <= this.range;
    }

    deactivate() {
        this.isActive = false;
    }
}