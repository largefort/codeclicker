// Import core functionality
import 'howler';
import { generateRandomCodeLine, getRandomCodeColor } from './utility.js';
import { createClickText, createPurchaseAnimation } from './clickAnimations.js';
import { formatNumber } from './numberFormatter.js';
import { initializeVisualEffects, createScreenFlash, applyScreenShake } from './postEffects.js';
import { initializeKeyboard, simulateTypingBurst } from './keyboard.js';
import { 
    gameState, 
    initializeGameState, 
    applyItemEffects, 
    recalculateLinesPerSecond 
} from './gameState.js';
import { setupShopItems, renderShop, updateShopItemStates } from './shopManager.js';
import { saveGame, loadGame, addNotification } from './saveManager.js';
import { updateUI, addCodeToDisplay, animateClick } from './uiManager.js';

// Sound effects
const sounds = {
    click: new Howl({
        src: ['data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVQAAAB/f3+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgH9/f39/f39/fw=='],
        volume: 0.3
    }),
    purchase: new Howl({
        src: ['data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVQAAAB/f39+fXx8fHt7fH1+f4CBgoODhIWFhYWFhISDgoGAf359fHt6eXh3d3Z2dnZ3d3h5ent8fX5/gIGCg4SFhoeIiYqKi4uLi4qJiA=='],
        volume: 0.4
    }),
    notification: new Howl({
        src: ['data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVQAAABramppamtvdHZ3eHl6e3t7e3p5eHd2dHNycXBvbm1tbW1tb3Fzc3V3eHl7fH1+f4CAf35+fXx7enl4d3Z1dHNycXFwcG9vb29wcHFxcnN0dXZ3eHl6fH1+'],
        volume: 0.3
    })
};

// Make game state available to other modules
window.gameState = gameState;
window.sounds = sounds; // Export sounds to window to make it globally available

// Handle clicking the computer
function handleComputerClick() {
    if (gameState.settings.soundEnabled) {
        sounds.click.play();
    }
    
    // Add lines based on current linesPerClick
    gameState.lines += gameState.linesPerClick;
    
    // Add cash based on lines and cashPerLine
    gameState.cash += gameState.linesPerClick * gameState.cashPerLine;
    
    // Update the UI
    updateUI();
    
    // Visual feedback
    animateClick();
    createClickText(gameState.linesPerClick);
    simulateTypingBurst();
    
    // Add some code to the display
    addCodeToDisplay(gameState.linesPerClick > 5 ? 2 : 1);
}

// Main game loop
function startGameLoop() {
    let lastTime = Date.now();
    let accumulatedTime = 0;
    
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - lastTime) / 1000; // in seconds
        lastTime = currentTime;
        
        // Generate lines of code based on lines per second
        if (gameState.linesPerSecond > 0) {
            const newLines = gameState.linesPerSecond * deltaTime;
            gameState.lines += newLines;
            gameState.cash += newLines * gameState.cashPerLine;
            
            // Show programmer coding activity on screen
            accumulatedTime += deltaTime;
            if (accumulatedTime >= 0.5) { // Every half second
                const programmerCount = gameState.programmers.reduce((total, prog) => total + prog.level, 0);
                if (programmerCount > 0) {
                    // Add a line of code for each programmer type with proportional probability
                    const shouldAddCode = Math.random() < 0.7; // 70% chance to add code
                    if (shouldAddCode) {
                        addCodeToDisplay(1);
                    }
                }
                accumulatedTime = 0;
            }
            
            // Update the UI if there are significant changes
            if (Math.floor(gameState.lines) > document.getElementById('lines').textContent) {
                updateUI();
            }
        }
        
        // Autosave every minute
        if (currentTime - gameState.lastSaveTime > 60000) {
            saveGame();
            gameState.lastSaveTime = currentTime;
        }
        
        // Update shop item states every second to reflect current cash
        if (Math.floor(accumulatedTime * 2) % 2 === 0) {
            updateShopItemStates();
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
}

// Game setup
function initGame() {
    initializeGameState();
    setupShopItems();
    setupEventListeners();
    loadGame();
    addCodeToDisplay(20); // Initialize with some code
    startGameLoop();
}

// Event listeners
function setupEventListeners() {
    // Computer click event
    document.getElementById('computer').addEventListener('click', handleComputerClick);
    
    // Shop item click events are set up in renderShop()
}

// Initialize the game when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initializeVisualEffects();
    initializeKeyboard();
});

export { 
    sounds, 
    saveGame, 
    loadGame, 
    updateUI, 
    updateShopItemStates, 
    applyItemEffects, 
    recalculateLinesPerSecond
};