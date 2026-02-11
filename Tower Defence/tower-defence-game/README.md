# Tower Defense Game

## Overview
This is a simple tower defense game where players earn money to buy new towers to destroy waves of enemies. The game features a wave system that progresses up to wave 50, with increasing difficulty by 2% for each wave. Upon reaching wave 50, a winning screen is displayed.

## Project Structure
```
tower-defence-game
├── src
│   ├── index.html          # Main HTML document for the game interface
│   ├── styles
│   │   └── style.css      # CSS styles for the game
│   ├── js
│   │   ├── main.js        # Entry point for JavaScript code
│   │   ├── game.js        # Manages overall game logic
│   │   ├── tower.js       # Defines the Tower class
│   │   ├── enemy.js       # Defines the Enemy class
│   │   ├── wave.js        # Manages the wave system
│   │   ├── ui.js          # Handles user interface
│   │   └── config.js      # Configuration constants
│   └── assets
│       └── data
│           └── towers.json # Data for different tower types
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using npm:
   ```
   npm install
   ```
4. Open `src/index.html` in a web browser to play the game.

## Gameplay Mechanics
- Players start with a certain amount of money and can purchase towers to defend against waves of enemies.
- Each wave increases in difficulty by 2%, requiring players to strategize their tower placements and upgrades.
- The game continues until wave 50, at which point a winning screen is displayed.

## Credits
- Developed by [Your Name]
- Inspired by classic tower defense games.