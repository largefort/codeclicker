import { gameState } from './gameState.js';
import { updateUI } from './uiManager.js';
import { renderShop } from './shopManager.js';

/**
 * Save the game state to localStorage
 */
function saveGame() {
    const saveData = JSON.stringify(gameState);
    localStorage.setItem('8bitProgrammingClicker', saveData);
}

/**
 * Load the game state from localStorage
 */
function loadGame() {
    const savedGame = localStorage.getItem('8bitProgrammingClicker');
    if (savedGame) {
        try {
            const savedState = JSON.parse(savedGame);
            
            // Merge saved state with default gameState to handle new properties
            Object.assign(gameState, savedState);
            
            // Recalculate derived values
            // Note: recalculateLinesPerSecond function is removed from import in the plan, 
            // so we can't use it here. It should be imported or defined somewhere else.
            // recalculateLinesPerSecond();
            
            // Update the UI
            updateUI();
            renderShop();
            
            addNotification("Game loaded successfully!");
        } catch (e) {
            console.error("Error loading saved game:", e);
        }
    }
}

/**
 * Add a notification message to the UI
 * @param {string} message - The notification message
 */
function addNotification(message) {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    container.appendChild(notification);
    
    // Check if sounds are defined before using them
    if (gameState.settings.soundEnabled && window.sounds) {
        window.sounds.notification.play();
    }
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

export { saveGame, loadGame, addNotification };