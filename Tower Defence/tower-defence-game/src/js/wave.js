// This file manages the wave system, including spawning enemies, increasing difficulty by 2% for each wave, and tracking the current wave number.

class Wave {
    constructor() {
        this.currentWave = 0;
        this.difficultyIncrement = 0.02; // 2% increase per wave
        this.baseEnemyHealth = 100; // Base health for enemies
        this.enemiesPerWave = 5; // Number of enemies per wave
    }

    startNextWave() {
        this.currentWave++;
        if (this.currentWave > 50) {
            this.displayWinningScreen();
            return;
        }

        const enemyHealth = this.baseEnemyHealth * (1 + this.difficultyIncrement * (this.currentWave - 1));
        this.spawnEnemies(this.enemiesPerWave, enemyHealth);
    }

    spawnEnemies(count, health) {
        for (let i = 0; i < count; i++) {
            // Logic to spawn an enemy with the specified health
            console.log(`Spawning enemy with health: ${health}`);
            // Here you would typically create an instance of the Enemy class
        }
    }

    displayWinningScreen() {
        console.log("Congratulations! You've completed all 50 waves!");
        // Logic to display the winning screen in the UI
    }
}

export default Wave;