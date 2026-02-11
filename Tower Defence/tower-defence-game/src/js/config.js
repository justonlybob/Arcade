const INITIAL_MONEY = 1000;
const TOWER_COSTS = {
    basic: 100,
    advanced: 200,
    sniper: 300,
};

const ENEMY_STATS = {
    health: 100,
    speed: 1,
};

const WAVE_DIFFICULTY_INCREMENT = 0.02; // 2% increase per wave
const MAX_WAVES = 50;

const WINNING_MESSAGE = "Congratulations! You've completed all waves!";

export {
    INITIAL_MONEY,
    TOWER_COSTS,
    ENEMY_STATS,
    WAVE_DIFFICULTY_INCREMENT,
    MAX_WAVES,
    WINNING_MESSAGE,
};