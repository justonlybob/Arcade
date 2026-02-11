let keys = {};
let touchLeft = false;
let touchRight = false;
let keySequence = [];

export function isLeftPressed() {
    return keys['ArrowLeft'] || keys['a'] || touchLeft;
}

export function isRightPressed() {
    return keys['ArrowRight'] || keys['d'] || touchRight;
}

export function getKeys() {
    return keys;
}

export function checkCheatCode() {
    // Check if last 3 keys pressed were 8, 0, 0
    if (keySequence.length >= 3) {
        const lastThree = keySequence.slice(-3).join('');
        if (lastThree === '800') {
            keySequence = [];
            return true;
        }
    }
    return false;
}

export function checkMasterCheatCode() {
    // Check if last 9 keys pressed were m, a, s, t, e, r, k, e, y
    if (keySequence.length >= 9) {
        const lastNine = keySequence.slice(-9).join('').toLowerCase();
        if (lastNine === 'masterkey') {
            keySequence = [];
            return true;
        }
    }
    return false;
}

export function initInput(gameContainer) {
    window.addEventListener('keydown', (e) => { 
        keys[e.key] = true;
        // Track numeric and letter key presses for cheat codes
        if ((e.key >= '0' && e.key <= '9') || (e.key.length === 1 && /[a-z]/i.test(e.key))) {
            keySequence.push(e.key.toLowerCase());
            // Keep only last 20 keys to prevent memory issues
            if (keySequence.length > 20) keySequence.shift();
        }
    });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    const leftTouch = document.createElement('div');
    leftTouch.className = 'touch-btn left';
    const rightTouch = document.createElement('div');
    rightTouch.className = 'touch-btn right';
    gameContainer.appendChild(leftTouch);
    gameContainer.appendChild(rightTouch);

    leftTouch.addEventListener('touchstart', (e) => { e.preventDefault(); touchLeft = true; });
    leftTouch.addEventListener('touchend', (e) => { e.preventDefault(); touchLeft = false; });
    rightTouch.addEventListener('touchstart', (e) => { e.preventDefault(); touchRight = true; });
    rightTouch.addEventListener('touchend', (e) => { e.preventDefault(); touchRight = false; });
}