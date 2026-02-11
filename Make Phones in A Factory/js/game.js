// Game State
const gameState = {
    phonesMade: 0,
    timeStarted: Date.now(),
    escapeProgress: 0,
    combo: 0,
    comboTimer: null,
    gameOver: false,
    isDemoted: false,
    lastPhoneTime: 0,
    phonesCooldown: 1000, // 1 second cooldown when demoted
    spaceHeld: false,
    autoClickInterval: null,
    pHeld: false,
    pAutoClickInterval: null,
    rightClickHeld: false,
    rightClickInterval: null,
    consecutiveSuccessfulMakes: 0,
    hasSpeedBoost: false,
    speedBoostEnd: 0,
    totalPhonesEverMade: localStorage.getItem('totalPhonesEverMade') ? parseInt(localStorage.getItem('totalPhonesEverMade')) : 0,
    bestTime: localStorage.getItem('bestTime') ? parseInt(localStorage.getItem('bestTime')) : 0,
    gamesPlayed: localStorage.getItem('gamesPlayed') ? parseInt(localStorage.getItem('gamesPlayed')) : 0
};

// DOM Elements
const phonesCountEl = document.getElementById('phonesCount');
const timeCountEl = document.getElementById('timeCount');
const efficiencyCountEl = document.getElementById('efficiencyCount');
const makePhoneBtn = document.getElementById('makePhoneBtn');
const escapeMeterEl = document.getElementById('escapeMeter');
const meterPercentEl = document.getElementById('meterPercent');
const escapeChanceEl = document.getElementById('escapeChance');
const escapeBtn = document.getElementById('escapeBtn');
const bossEmojiEl = document.getElementById('bossEmoji');
const bossMessageEl = document.getElementById('bossMessage');
const bossAngerEl = document.getElementById('bossAnger');
const gameOverModal = document.getElementById('gameOverModal');
const modalEmojiEl = document.getElementById('modalEmoji');
const modalTitleEl = document.getElementById('modalTitle');
const modalTextEl = document.getElementById('modalText');
const finalPhonesEl = document.getElementById('finalPhones');
const finalTimeEl = document.getElementById('finalTime');
const comboIndicatorEl = document.getElementById('comboIndicator');
const difficultyBadgeEl = document.getElementById('difficultyBadge');

// Boss messages
const bossMessages = {
    start: [
        "Get to work! Make phones NOW!",
        "I want phones! PHONES!",
        "Stop slacking and work!",
        "The quota won't meet itself!",
        "My coffee's getting cold... WORK FASTER!",
        "Those phones won't make themselves!",
        "I expect 100% productivity!"
    ],
    mid: [
        "Keep it up, but not too fast...",
        "More! I NEED more phones!",
        "You're almost at quota... almost...",
        "Work, work, WORK!",
        "Are you trying to escape? Nice try!",
        "I'm watching you...",
        "Your speed is impressive... TOO impressive!"
    ],
    danger: [
        "WHY ARE YOU WORKING SO FAST?!",
        "You think you can escape?!",
        "I see what you're doing!",
        "YOU'LL NEVER GET OUT!",
        "Work faster, but NOT FOR ESCAPE!",
        "SUSPICIOUS ACTIVITY DETECTED!",
        "One more escape attempt and YOU'RE DONE!"
    ]
};

// Calculate escape chance based on phones made
function getEscapeChance() {
    // If demoted, need 500 phones to escape
    if (gameState.isDemoted) {
        const demoChance = Math.min(Math.floor((gameState.phonesMade / 500) * 95), 95);
        return demoChance;
    }
    // Chance starts at 1% and increases with phones
    // At 50 phones: 25%, at 100 phones: 50%, at 150 phones: 75%, capped at 95%
    const baseChance = Math.min(Math.floor((gameState.phonesMade / 2)), 95);
    return baseChance;
}

// Calculate escape meter percentage
function getEscapeMeterPercent() {
    // Meter fills based on escape chance
    if (gameState.isDemoted) {
        return Math.min((gameState.phonesMade / 2500) * 100, 100);
    }
    return Math.min((gameState.phonesMade / 1000) * 100, 100);
}

// Get difficulty level
function getDifficulty() {
    if (gameState.phonesMade < 30) return 'easy';
    if (gameState.phonesMade < 60) return 'medium';
    if (gameState.phonesMade < 100) return 'hard';
    return 'insane';
}

// Update difficulty badge
function updateDifficultyBadge() {
    const difficulty = getDifficulty();
    const difficultyText = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
        insane: 'INSANE'
    };
    difficultyBadgeEl.textContent = difficultyText[difficulty];
    difficultyBadgeEl.className = `difficulty-indicator difficulty-${difficulty}`;
}

// Update boss emotion
function updateBossState() {
    const angerPercent = Math.min((gameState.phonesMade / 3), 100);
    let bossEmoji = '😈';
    let messageType = 'start';

    // Boss stops talking in last 10% of game
    const escapeChance = getEscapeChance();
    if (escapeChance > 90) {
        bossEmojiEl.textContent = '😶';
        bossMessageEl.textContent = '...';
        return;
    }

    if (angerPercent > 70) {
        bossEmoji = '😤';
        messageType = 'danger';
    } else if (angerPercent > 40) {
        bossEmoji = '😠';
        messageType = 'mid';
    } else {
        bossEmoji = '😈';
        messageType = 'start';
    }

    bossEmojiEl.textContent = bossEmoji;
    
    // Update message periodically
    if (Math.random() < 0.3) {
        const messages = bossMessages[messageType];
        bossMessageEl.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

// Make a phone
function makePhone() {
    if (gameState.gameOver) return;

    // Check cooldown if demoted
    if (gameState.isDemoted) {
        const timeSinceLastPhone = Date.now() - gameState.lastPhoneTime;
        if (timeSinceLastPhone < gameState.phonesCooldown) {
            return;
        }
    }

    gameState.lastPhoneTime = Date.now();
    gameState.phonesMade++;
    gameState.consecutiveSuccessfulMakes++;
    gameState.combo++;

    // Speed boost every 50 consecutive makes (10% faster for 5 seconds)
    if (gameState.consecutiveSuccessfulMakes % 50 === 0 && !gameState.isDemoted) {
        activateSpeedBoost();
    }

    // Check for demotion every 25 phones
    if (gameState.phonesMade % 25 === 0 && !gameState.isDemoted && !gameState.rightClickHeld) {
        const demotionChance = Math.random() * 100;
        if (demotionChance < 1) {
            demotePlayer();
            gameState.consecutiveSuccessfulMakes = 0;
        }
    }

    // At 99% escape chance (near the end), 1% chance to demote (only if not right-clicking)
    const escapeChance = getEscapeChance();
    if (escapeChance >= 99 && !gameState.isDemoted && !gameState.rightClickHeld) {
        const finalDemotionChance = Math.random() * 100;
        if (finalDemotionChance < 1) {
            demotePlayer();
            gameState.consecutiveSuccessfulMakes = 0;
        }
    }

    // Update combo display with milestone notifications
    if (gameState.combo > 1) {
        comboIndicatorEl.textContent = `🔥 COMBO x${gameState.combo}!`;
        comboIndicatorEl.classList.add('combo-active');
        setTimeout(() => comboIndicatorEl.classList.remove('combo-active'), 300);
        
        // Milestone notifications
        if (gameState.combo === 10) {
            comboIndicatorEl.textContent = '🔥 COMBO x10 - Nice!';
        } else if (gameState.combo === 25) {
            comboIndicatorEl.textContent = '🔥 COMBO x25 - On Fire!';
        } else if (gameState.combo === 50) {
            comboIndicatorEl.textContent = '🔥 COMBO x50 - Unstoppable!';
        }
    }

    // Reset combo timer
    clearTimeout(gameState.comboTimer);
    gameState.comboTimer = setTimeout(() => {
        gameState.combo = 0;
        comboIndicatorEl.textContent = '';
    }, 2000);

    updateUI();
    updateBossState();
    updateDifficultyBadge();

    // Check if can enable escape button
    if (getEscapeChance() > 0) {
        escapeBtn.disabled = false;
    }
}

// Demote the player
function demotePlayer() {
    gameState.isDemoted = true;
    makePhoneBtn.style.color = '#ff6b6b';
    makePhoneBtn.textContent = '⚠️ DEMOTED! Make Phone (+1)';
    bossMessageEl.textContent = 'YOU\'RE FIRED! I mean... DEMOTED!';
    bossEmojiEl.textContent = '😈';
    
    // Show demotion message for a bit
    setTimeout(() => {
        makePhoneBtn.textContent = 'Make Phone (+1)';
        makePhoneBtn.style.color = 'white';
    }, 3000);
}

// Activate speed boost
function activateSpeedBoost() {
    gameState.hasSpeedBoost = true;
    gameState.speedBoostEnd = Date.now() + 5000; // 5 second boost
    makePhoneBtn.style.backgroundColor = '#FFD700';
    makePhoneBtn.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.6)';
    bossMessageEl.textContent = 'WHOA! SLOW DOWN! 😱';
    bossEmojiEl.textContent = '😱';
    
    // Reset after 5 seconds
    setTimeout(() => {
        if (gameState.hasSpeedBoost) {
            gameState.hasSpeedBoost = false;
            makePhoneBtn.style.backgroundColor = '';
            makePhoneBtn.style.boxShadow = '';
        }
    }, 5000);
}

// Attempt escape
function attemptEscape() {
    if (gameState.gameOver) return;

    const escapeChance = getEscapeChance();
    
    // At 100% escape chance, automatically win
    if (escapeChance >= 100) {
        gameState.gameOver = true;
        endGame(true);
        return;
    }

    const random = Math.random() * 100;

    if (random < escapeChance) {
        // Escape successful!
        gameState.gameOver = true;
        endGame(true);
    } else {
        // Caught!
        gameState.gameOver = true;
        endGame(false);
    }
}

// End game
function endGame(escaped) {
    makePhoneBtn.disabled = true;
    escapeBtn.disabled = true;

    const timeWorked = Math.floor((Date.now() - gameState.timeStarted) / 1000);
    
    // Update stats
    gameState.totalPhonesEverMade += gameState.phonesMade;
    gameState.gamesPlayed++;
    
    if (escaped && (gameState.bestTime === 0 || timeWorked < gameState.bestTime)) {
        gameState.bestTime = timeWorked;
    }
    
    // Save to localStorage
    localStorage.setItem('totalPhonesEverMade', gameState.totalPhonesEverMade);
    localStorage.setItem('bestTime', gameState.bestTime);
    localStorage.setItem('gamesPlayed', gameState.gamesPlayed);

    if (escaped) {
        modalEmojiEl.textContent = '🎉';
        modalTitleEl.textContent = 'You Escaped!';
        const demoStatus = gameState.isDemoted ? ' (While Demoted!)' : '';
        const bestTimeText = gameState.bestTime === timeWorked ? ' ⭐ NEW BEST TIME!' : '';
        modalTextEl.textContent = `Congratulations! You made ${gameState.phonesMade} phones and broke free from the factory!${demoStatus}\n\nTime: ${formatTime(timeWorked)}${bestTimeText}`;
        gameOverModal.classList.add('success');
    } else {
        modalEmojiEl.textContent = '😭';
        modalTitleEl.textContent = 'You Got Caught!';
        const demoStatus = gameState.isDemoted ? ' with a demotion slowdown!' : '';
        modalTextEl.textContent = `Oh no! The boss caught you trying to escape${demoStatus}!\n\nYou made it to ${gameState.phonesMade} phones before getting caught. Better luck next time!`;
        gameOverModal.classList.add('caught');
    }

    finalPhonesEl.textContent = gameState.phonesMade;
    finalTimeEl.textContent = formatTime(timeWorked);
    
    // Add stats to modal
    const statsHtml = `
        <p>Phones Made: <strong>${gameState.phonesMade}</strong></p>
        <p>Time Worked: <strong>${formatTime(timeWorked)}</strong></p>
        <p>Total Phones (All Time): <strong>${gameState.totalPhonesEverMade}</strong></p>
        <p>Games Played: <strong>${gameState.gamesPlayed}</strong></p>
        ${gameState.bestTime > 0 ? `<p>Best Escape Time: <strong>${formatTime(gameState.bestTime)}</strong></p>` : ''}
    `;
    document.getElementById('modalStats').innerHTML = statsHtml;
    
    gameOverModal.style.display = 'block';
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
        return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
}

// Update all UI
function updateUI() {
    const timeWorked = Math.floor((Date.now() - gameState.timeStarted) / 1000);
    const efficiency = timeWorked > 0 ? Math.floor((gameState.phonesMade / timeWorked) * 60) : 0;

    phonesCountEl.textContent = gameState.phonesMade;
    timeCountEl.textContent = formatTime(timeWorked);
    efficiencyCountEl.textContent = efficiency + '/min';

    // Update escape meter
    const escapePercent = getEscapeMeterPercent();
    escapeMeterEl.style.width = escapePercent + '%';
    meterPercentEl.textContent = Math.floor(escapePercent) + '%';

    // Update escape chance
    const escapeChance = getEscapeChance();
    escapeChanceEl.textContent = `Escape Chance: ${escapeChance}%${gameState.isDemoted ? ' (DEMOTED)' : ''}`;

    // Update button text with cooldown indicator if demoted
    if (gameState.isDemoted) {
        const timeSinceLastPhone = Date.now() - gameState.lastPhoneTime;
        if (timeSinceLastPhone < gameState.phonesCooldown) {
            const remainingMs = gameState.phonesCooldown - timeSinceLastPhone;
            const remainingSec = (remainingMs / 1000).toFixed(1);
            makePhoneBtn.textContent = `Make Phone (+1) [${remainingSec}s]`;
        } else {
            makePhoneBtn.textContent = `Make Phone (+1)`;
        }
    } else if (gameState.hasSpeedBoost) {
        const timeLeft = gameState.speedBoostEnd - Date.now();
        if (timeLeft > 0) {
            makePhoneBtn.textContent = `⚡ SPEED BOOST! Make Phone (+1)`;
        }
    } else {
        makePhoneBtn.textContent = `Make Phone (+1)`;
    }

    // Update boss anger level
    const angerPercent = Math.min((gameState.phonesMade / 3), 100);
    bossAngerEl.textContent = `Anger Level: ${Math.floor(angerPercent)}%${gameState.isDemoted ? ' 😤' : ''}`;
}

// Event listeners
makePhoneBtn.addEventListener('click', makePhone);
escapeBtn.addEventListener('click', attemptEscape);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameState.gameOver) {
            gameState.spaceHeld = true;
            // Start auto-clicking
            gameState.autoClickInterval = setInterval(() => {
                if (gameState.spaceHeld && !gameState.gameOver) {
                    makePhone();
                }
            }, 100); // Click 10 times per second
            makePhone(); // Make one immediately
        }
    }
    if (e.code === 'KeyP') {
        e.preventDefault();
        if (!gameState.gameOver) {
            gameState.pHeld = true;
            // Start auto-clicking at 50 CPS
            gameState.pAutoClickInterval = setInterval(() => {
                if (gameState.pHeld && !gameState.gameOver) {
                    makePhone();
                }
            }, 20); // Click 50 times per second
            makePhone(); // Make one immediately
        }
    }
    if (e.code === 'Enter') {
        e.preventDefault();
        if (!escapeBtn.disabled && !gameState.gameOver) attemptEscape();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        gameState.spaceHeld = false;
        if (gameState.autoClickInterval) {
            clearInterval(gameState.autoClickInterval);
            gameState.autoClickInterval = null;
        }
    }
    if (e.code === 'KeyP') {
        e.preventDefault();
        gameState.pHeld = false;
        if (gameState.pAutoClickInterval) {
            clearInterval(gameState.pAutoClickInterval);
            gameState.pAutoClickInterval = null;
        }
    }
});

// Right-click for 10000 CPS (prevent context menu)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!gameState.gameOver) {
        gameState.rightClickHeld = true;
        // Start auto-clicking at 10000 CPS
        gameState.rightClickInterval = setInterval(() => {
            if (gameState.rightClickHeld && !gameState.gameOver) {
                makePhone();
            }
        }, 0.1); // Click 10000 times per second
        makePhone(); // Make one immediately
    }
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) { // Right-click release
        gameState.rightClickHeld = false;
        if (gameState.rightClickInterval) {
            clearInterval(gameState.rightClickInterval);
            gameState.rightClickInterval = null;
        }
    }
});

// Update UI every 100ms
setInterval(updateUI, 100);

// Initialize
updateUI();
updateBossState();
updateDifficultyBadge();
