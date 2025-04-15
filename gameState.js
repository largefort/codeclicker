// Game state management for 8bit Programming Clicker

// Initialize game state with default values
const gameState = {
    lines: 0,
    linesPerClick: 1,
    linesPerSecond: 0,
    cash: 0,
    cashPerLine: 0.1,
    upgrades: [],
    programmers: [],
    officeUpgrades: [],
    achievements: [],
    lastSaveTime: Date.now(),
    settings: {
        soundEnabled: true,
        pixelSize: 4
    }
};

/**
 * Initialize the game state
 */
function initializeGameState() {
    // This function can be expanded in the future
    // to handle more complex state initialization
}

/**
 * Apply the effects of purchased items
 * @param {Object} item - The purchased item
 * @param {string} itemType - The type of item (upgrade, programmer, office)
 */
function applyItemEffects(item, itemType) {
    if (itemType === 'upgrade') {
        if (item.effect.linesPerClick) {
            gameState.linesPerClick += item.effect.linesPerClick;
        }
    } else if (itemType === 'programmer') {
        recalculateLinesPerSecond();
    } else if (itemType === 'office') {
        if (item.effect.programmerMultiplier) {
            recalculateLinesPerSecond();
        }
        if (item.effect.cashPerLineMultiplier) {
            gameState.cashPerLine *= (1 + item.effect.cashPerLineMultiplier);
        }
    }
}

/**
 * Recalculate the total lines per second based on programmers and multipliers
 */
function recalculateLinesPerSecond() {
    let lps = 0;
    
    // Base LPS from programmers
    gameState.programmers.forEach(programmer => {
        lps += programmer.effect.linesPerSecond * programmer.level;
    });
    
    // Apply multipliers from office upgrades
    const betterMonitors = gameState.officeUpgrades.find(u => u.id === 'better-monitors');
    if (betterMonitors && betterMonitors.level > 0) {
        const multiplier = 1 + (betterMonitors.effect.programmerMultiplier * betterMonitors.level);
        lps *= multiplier;
    }
    
    gameState.linesPerSecond = lps;
}

export { gameState, initializeGameState, applyItemEffects, recalculateLinesPerSecond };