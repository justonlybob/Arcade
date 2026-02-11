const CHARACTERS_LEVEL_1 = [
    { name: "Ironclad", icon: "🛡️", hp: 140, atk: 15, def: 10, ability: "Defensive Stance", passive: "Iron Will", desc: "Tanky. Passive: Boosts Defense at <10% HP." },
    { name: "Shadow", icon: "🥷", hp: 90, atk: 25, def: 3, ability: "True Strike", passive: "Evasion", desc: "Glass cannon. Passive: 50% dodge at <10% HP." },
    { name: "Phoenix", icon: "🐦‍🔥", hp: 110, atk: 18, def: 5, ability: "Flame Burst", passive: "Rebirth", desc: "Balanced. Passive: Small heal at <10% HP." },
    { name: "Cyber-V", icon: "🤖", hp: 100, atk: 20, def: 6, ability: "Overclock", passive: "Logic Drive", desc: "Precise. Passive: Double Atk at <10% HP." },
    { name: "Valkyrie", icon: "⚔️", hp: 120, atk: 17, def: 7, ability: "Heavenly Spear", passive: "Valor", desc: "Sturdy. Passive: Defense up at <10% HP." },
    { name: "Frostbite", icon: "❄️", hp: 105, atk: 16, def: 6, ability: "Ice Shard", passive: "Frost Armor", desc: "Control. Passive: Halves enemy Atk at <10% HP." },
    { name: "Goliath", icon: "👹", hp: 160, atk: 12, def: 12, ability: "Earthquake", passive: "Rage", desc: "Juggernaut. Passive: Atk up at <10% HP." },
    { name: "Mystic", icon: "🔮", hp: 85, atk: 30, def: 2, ability: "Arcane Beam", passive: "Mana Surge", desc: "Mage. Passive: Infinite special use at <10% HP." },
    { name: "Reaper", icon: "💀", hp: 95, atk: 22, def: 4, ability: "Life Siphon", passive: "Soul Eater", desc: "Lifesteal. Passive: Double Lifesteal at <10% HP." },
    { name: "Thunder", icon: "⚡", hp: 100, atk: 24, def: 4, ability: "Bolt Blast", passive: "Static Charge", desc: "Electric. Passive: Stuns enemy at <10% HP." }
];

const CHARACTERS_LEVEL_2 = [
    { name: "Void-Walker", icon: "🌌", hp: 130, atk: 28, def: 8, ability: "Rift Strike", passive: "Phasing", desc: "Space-time master. Passive: 30% to ignore damage." },
    { name: "Solaris", icon: "☀️", hp: 150, atk: 22, def: 12, ability: "Supernova", passive: "Radiance", desc: "The Sun Incarnate. Passive: Burn enemy every turn." },
    { name: "Necros", icon: "🧟", hp: 180, atk: 18, def: 5, ability: "Soul Harvest", passive: "Undeath", desc: "Lich lord. Passive: Revives once at 1 HP." },
    { name: "Blade-Master", icon: "⚔️", hp: 110, atk: 35, def: 4, ability: "Zenith Slash", passive: "Counter", desc: "Legendary swordsman. Passive: Counters for 50% dmg." },
    { name: "Abyss", icon: "🌑", hp: 200, atk: 15, def: 15, ability: "Dark Gravity", passive: "Nullify", desc: "The deep end. Passive: Ignores enemy buffs." },
    { name: "Inferno", icon: "🔥", hp: 120, atk: 32, def: 6, ability: "Magma Wave", passive: "Heat Aura", desc: "Burning rage. Passive: Atk increases every turn." },
    { name: "Titan", icon: "🏔️", hp: 250, atk: 14, def: 20, ability: "Avalanche", passive: "Fortress", desc: "Living mountain. Passive: Cannot be crit." },
    { name: "Rogue-AI", icon: "💻", hp: 95, atk: 40, def: 2, ability: "Binary Spike", passive: "Adaptation", desc: "Glitchy power. Passive: Randomly gains Atk/Def bonus." },
    { name: "Storm-Lord", icon: "⛈️", hp: 140, atk: 25, def: 10, ability: "Tornado", passive: "Wind Shield", desc: "Master of skies. Passive: Higher chance to dodge specials." },
    { name: "Paladin", icon: "✨", hp: 160, atk: 20, def: 15, ability: "Holy Light", passive: "Justice", desc: "Holy warrior. Passive: Heals while attacking." }
];

let currentLevelData = CHARACTERS_LEVEL_1;
let currentLevel = 1;
let player, enemy;
let stage = 1;
let maxStages = 5;
let playerCurrentHP, enemyCurrentHP;

const screens = {
    select: document.getElementById('selection-screen'),
    battle: document.getElementById('battle-screen'),
    result: document.getElementById('result-screen')
};

// Initialize Selection Grid
function initSelection() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = ''; // Clear previous
    document.querySelector('#selection-screen h1').textContent = `LEVEL ${currentLevel}: SELECT YOUR CHAMPION`;
    
    currentLevelData.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="icon">${char.icon}</div>
            <div class="name">${char.name}</div>
            <div class="desc">${char.desc}</div>
        `;
        card.onclick = () => startGame(char);
        grid.appendChild(card);
    });
}

function startGame(selectedChar) {
    player = { ...selectedChar };
    playerCurrentHP = player.hp;
    stage = 1;
    
    screens.select.classList.add('hidden');
    setTimeout(() => {
        screens.select.style.display = 'none';
        screens.battle.style.display = 'flex';
        screens.battle.classList.remove('hidden');
        loadStage();
    }, 500);
}

function loadStage() {
    // Pick a random enemy that isn't the player
    let enemyChar;
    do {
        enemyChar = currentLevelData[Math.floor(Math.random() * currentLevelData.length)];
    } while (enemyChar.name === player.name);

    enemy = { ...enemyChar };
    // Enemies get stronger with stages
    enemy.hp += stage * 10;
    enemy.atk += stage * 2;
    enemyCurrentHP = enemy.hp;

    updateUI();
    log(`Stage ${stage}: ${enemy.name} challenges you!`);
    createActionButtons();
}

function updateUI() {
    document.getElementById('stage-count').textContent = `Level ${currentLevel} - Stage ${stage} / ${maxStages}`;
    
    // Player
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-sprite').textContent = player.icon;
    const playerHPPercent = (playerCurrentHP / player.hp) * 100;
    document.getElementById('player-hp').style.width = playerHPPercent + '%';
    document.getElementById('player-hp-text').textContent = `${Math.ceil(playerCurrentHP)} / ${player.hp}`;

    // Enemy
    document.getElementById('enemy-name').textContent = enemy.name;
    document.getElementById('enemy-sprite').textContent = enemy.icon;
    const enemyHPPercent = (enemyCurrentHP / enemy.hp) * 100;
    document.getElementById('enemy-hp').style.width = enemyHPPercent + '%';
    document.getElementById('enemy-hp-text').textContent = `${Math.ceil(enemyCurrentHP)} / ${enemy.hp}`;
}

function createActionButtons() {
    const container = document.getElementById('action-buttons');
    container.innerHTML = '';
    
    const actions = [
        { name: 'Attack', type: 'atk' },
        { name: player.ability, type: 'special' },
        { name: 'Heal', type: 'heal' },
        { name: 'Ultimate Strike', type: 'desperation' }
    ];

    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = action.name;
        btn.onclick = () => handlePlayerTurn(action);
        container.appendChild(btn);
    });
}

async function handlePlayerTurn(action) {
    disableButtons(true);
    
    let damage = 0;
    let message = "";
    let selfDamage = 0;

    // Check Passive Activation
    const isPassiveActive = playerCurrentHP <= player.hp * 0.1;
    if (isPassiveActive) {
        log(`✨ ${player.passive} ACTIVE!`);
    }

    if (action.type === 'atk') {
        let atkPower = player.atk;
        if (isPassiveActive && player.name === "Cyber-V") atkPower *= 2;
        if (isPassiveActive && player.name === "Goliath") atkPower *= 1.5;
        
        damage = atkPower - (enemy.def / 2) + (Math.random() * 5);
        message = `${player.name} attacks ${enemy.name} for ${Math.floor(damage)} damage!`;
    } else if (action.type === 'special') {
        let specialPower = 1.5;
        if (isPassiveActive && player.name === "Mystic") specialPower = 2.5;
        
        damage = player.atk * specialPower - (enemy.def / 3);
        message = `${player.name} uses ${player.ability}! It deals ${Math.floor(damage)} damage!`;
        
        if (player.name === "Reaper") {
            let steal = damage * (isPassiveActive ? 0.6 : 0.3);
            playerCurrentHP = Math.min(player.hp, playerCurrentHP + steal);
            log(`${player.name} siphons ${Math.floor(steal)} HP!`);
        }
    } else if (action.type === 'heal') {
        let healAmt = player.hp * 0.2;
        if (isPassiveActive && player.name === "Phoenix") healAmt *= 2;
        playerCurrentHP = Math.min(player.hp, playerCurrentHP + healAmt);
        message = `${player.name} heals for ${Math.floor(healAmt)} HP!`;
    } else if (action.type === 'desperation') {
        // High damage, High cost
        selfDamage = player.hp * 0.25;
        damage = player.atk * 3.5; // Massive damage
        message = `${player.name} UNLEASHES AN ULTIMATE STRIKE! (Suffers ${Math.floor(selfDamage)} self-damage)`;
    }

    if (damage > 0) {
        // Frostbite Passive Check (reduces damage of current unit if attacking unit is frostbite) - though passives are personal
        enemyCurrentHP = Math.max(0, enemyCurrentHP - damage);
        animateDamage('enemy', Math.floor(damage));
    }

    if (selfDamage > 0) {
        playerCurrentHP = Math.max(0, playerCurrentHP - selfDamage);
        animateDamage('player', Math.floor(selfDamage));
    }
    
    updateUI();
    log(message);
    await wait(800);

    if (playerCurrentHP <= 0) {
        gameOver();
        return;
    }

    if (enemyCurrentHP <= 0) {
        winStage();
    } else {
        enemyTurn();
    }
}

async function enemyTurn() {
    log(`${enemy.name} is preparing to strike...`);
    await wait(1000);

    // Enemy Passive Activation
    const isEnemyPassiveActive = enemyCurrentHP <= enemy.hp * 0.1;
    if (isEnemyPassiveActive) {
        log(`⚠️ Enemy ${enemy.passive} TRIGGERED!`);
    }

    // Shadow Passive: 50% dodge
    if (isEnemyPassiveActive && enemy.name === "Shadow" && Math.random() < 0.5) {
        log(`${enemy.name} dodged the incoming prediction!`);
        // Note: Dodge logic usually happens on player hit, but we'll simulate a counter-evasion here
    }

    const isSpecial = Math.random() > 0.7;
    let damage = 0;

    let atkPower = enemy.atk;
    if (isEnemyPassiveActive && enemy.name === "Goliath") atkPower *= 1.5;
    if (isEnemyPassiveActive && enemy.name === "Cyber-V") atkPower *= 2;

    if (isSpecial) {
        damage = (atkPower * 1.3) - (player.def / 2);
        log(`${enemy.name} unleashes ${enemy.ability}!`);
    } else {
        damage = atkPower - (player.def / 2);
        log(`${enemy.name} strikes back!`);
    }

    // Ironclad and Valkyrie passive defense
    if (playerCurrentHP <= player.hp * 0.1) {
        if (player.name === "Ironclad") damage *= 0.3; // 70% reduction
        if (player.name === "Valkyrie") damage *= 0.6; // 40% reduction
    }

    damage = Math.max(2, damage + (Math.random() * 5));
    playerCurrentHP = Math.max(0, playerCurrentHP - damage);
    animateDamage('player', Math.floor(damage));
    updateUI();
    
    await wait(800);

    if (playerCurrentHP <= 0) {
        gameOver();
    } else {
        disableButtons(false);
    }
}

function winStage() {
    log(`${enemy.name} has been defeated!`);
    
    // Boost stats
    player.hp += (currentLevel === 1 ? 20 : 35);
    player.atk += (currentLevel === 1 ? 5 : 8);
    player.def += (currentLevel === 1 ? 2 : 4);
    log(`✨ LEVEL UP! Stats Increased!`);

    if (stage >= maxStages) {
        if (currentLevel === 1) {
            startLevel2();
        } else {
            victory();
        }
    } else {
        stage++;
        // Small heal between rounds
        playerCurrentHP = Math.min(player.hp, playerCurrentHP + (player.hp * 0.4));
        setTimeout(loadStage, 1500);
    }
}

function startLevel2() {
    log("🏆 LEVEL 1 COMPLETE! PREPARE FOR THE ELITE GAUNTLET.");
    currentLevel = 2;
    currentLevelData = CHARACTERS_LEVEL_2;
    maxStages = 10;
    stage = 1;
    
    // Switch to results screen briefly for the announcement
    screens.battle.classList.add('hidden');
    setTimeout(() => {
        screens.battle.style.display = 'none';
        screens.result.style.display = 'flex';
        screens.result.classList.remove('hidden');
        
        document.getElementById('result-title').textContent = "LEVEL 1 COMPLETE!";
        document.getElementById('result-message').textContent = "The Elite Gauntlet awaits. Select your new champion for Level 2.";
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'menu-btn';
        nextBtn.textContent = "ENTER LEVEL 2";
        nextBtn.id = 'temp-next-btn';
        nextBtn.onclick = () => {
            document.getElementById('temp-next-btn').remove();
            screens.result.classList.add('hidden');
            setTimeout(() => {
                screens.result.style.display = 'none';
                screens.select.style.display = 'flex';
                screens.select.classList.remove('hidden');
                initSelection();
            }, 500);
        };
        document.querySelector('#result-screen').appendChild(nextBtn);
    }, 500);
}

function victory() {
    screens.battle.classList.add('hidden');
    setTimeout(() => {
        screens.battle.style.display = 'none';
        screens.result.style.display = 'flex';
        screens.result.classList.remove('hidden');
        document.getElementById('result-title').textContent = "TRIUMPH!";
        document.getElementById('result-message').textContent = `The legend of ${player.name} will be remembered forever.`;
    }, 500);
}

function gameOver() {
    screens.battle.classList.add('hidden');
    setTimeout(() => {
        screens.battle.style.display = 'none';
        screens.result.style.display = 'flex';
        screens.result.classList.remove('hidden');
        document.getElementById('result-title').textContent = "DEFEAT";
        document.getElementById('result-message').textContent = `${player.name} fell in stage ${stage}.`;
    }, 500);
}

function log(msg) {
    const logEl = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.textContent = `> ${msg}`;
    logEl.insertBefore(entry, logEl.firstChild);
}

function animateDamage(target, amount) {
    const targetEl = document.getElementById(`${target}-sprite`);
    targetEl.parentElement.classList.add('shake');
    setTimeout(() => targetEl.parentElement.classList.remove('shake'), 300);

    const num = document.createElement('div');
    num.className = 'damage-num';
    num.textContent = `-${amount}`;
    targetEl.parentElement.appendChild(num);
    setTimeout(() => num.remove(), 1000);
}

function disableButtons(disabled) {
    const btns = document.querySelectorAll('.action-btn');
    btns.forEach(b => b.disabled = disabled);
}

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function showStats() {
    if (!player) return;
    const statsMsg = `--- ${player.name} STATS ---\n` +
                 `HP: ${Math.ceil(playerCurrentHP)} / ${player.hp}\n` +
                 `ATK: ${player.atk}\n` +
                 `DEF: ${player.def}\n` +
                 `PASSIVE: ${player.passive}\n` +
                 `STAGE: ${stage}`;
    alert(statsMsg);
}

// Add Keyboard Listener for 'S'
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
        showStats();
    }
});

// Start logic
initSelection();
