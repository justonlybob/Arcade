// File: /tower-defence-game/tower-defence-game/src/js/game.js

class Game {
    constructor() {
        this.isRunning = false;
        this.currentWave = 0;
        this.playerMoney = 100; // Starting money
        this.waves = [];
        this.maxWaves = 50;
    }

    start() {
        this.isRunning = true;
        this.currentWave = 0;
        this.playerMoney = 100;
        this.waves = [];
        this.nextWave();
    }

    stop() {
        this.isRunning = false;
        // Additional logic for stopping the game can be added here
    }

    nextWave() {
        if (this.currentWave < this.maxWaves) {
            this.currentWave++;
            this.spawnEnemies();
            this.increaseDifficulty();
        } else {
            this.winGame();
        }
    }

    spawnEnemies() {
        // Logic to spawn enemies based on the current wave
        console.log(`Spawning enemies for wave ${this.currentWave}`);
    }

    increaseDifficulty() {
        // Logic to increase enemy difficulty by 2% for each wave
        const difficultyIncrease = 1 + (this.currentWave * 0.02);
        console.log(`Current difficulty multiplier: ${difficultyIncrease}`);
    }

    winGame() {
        this.stop();
        console.log("Congratulations! You've completed all waves!");
        // Logic to display winning screen can be added here
    }

    earnMoney(amount) {
        this.playerMoney += amount;
        console.log(`Player money: ${this.playerMoney}`);
    }
}

// Export the Game class for use in other modules
export default Game;