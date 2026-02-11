// This file handles the user interface, including displaying the player's money, wave number, and the winning screen at wave 50.

const ui = (() => {
    const moneyDisplay = document.getElementById('money');
    const waveDisplay = document.getElementById('wave');
    const winScreen = document.getElementById('win-screen');

    const updateMoney = (money) => {
        moneyDisplay.innerText = `Money: $${money}`;
    };

    const updateWave = (wave) => {
        waveDisplay.innerText = `Wave: ${wave}`;
    };

    const showWinScreen = () => {
        winScreen.style.display = 'block';
        winScreen.innerText = 'Congratulations! You have completed all 50 waves!';
    };

    return {
        updateMoney,
        updateWave,
        showWinScreen
    };
})();

export default ui;