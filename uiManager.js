import { gameState } from './gameState.js'; 
import { formatNumber } from './numberFormatter.js';
import { generateRandomCodeLine, getRandomCodeColor } from './utility.js';

/**
 * Update the UI with current game state values
 */
function updateUI() {
    document.getElementById('lines').textContent = formatNumber(gameState.lines);
    document.getElementById('lps').textContent = formatNumber(gameState.linesPerSecond, true);
    document.getElementById('cash').textContent = formatNumber(gameState.cash);
    
    // Also update shop item states when UI is updated
    import('./game.js').then(({ updateShopItemStates }) => {
        updateShopItemStates();
    });
}

/**
 * Initialize the code display
 */
function initCodeDisplay() {
    addCodeToDisplay(20); // Add some initial code
}

/**
 * Add new lines of code to the display
 * @param {number} lines - Number of lines to add
 */
function addCodeToDisplay(lines = 1) {
    const codeDisplay = document.getElementById('code-display');
    
    for (let i = 0; i < lines; i++) {
        const randomSnippet = generateRandomCodeLine();
        const codeLine = document.createElement('div');
        codeLine.textContent = randomSnippet;
        codeLine.style.color = getRandomCodeColor();
        codeDisplay.appendChild(codeLine);
        
        // Keep only the last 50 lines
        if (codeDisplay.children.length > 50) {
            codeDisplay.removeChild(codeDisplay.children[0]);
        }
    }
    
    // Auto-scroll to bottom
    codeDisplay.scrollTop = codeDisplay.scrollHeight;
}

/**
 * Visual feedback when clicking the computer
 */
function animateClick() {
    const computer = document.getElementById('computer');
    computer.classList.add('clicked');
    
    // Create a flash effect on the screen
    const screen = document.querySelector('.computer-screen');
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    flash.style.pointerEvents = 'none';
    flash.style.animation = 'flash 0.3s forwards';
    
    screen.appendChild(flash);
    
    setTimeout(() => {
        computer.classList.remove('clicked');
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, 300);
}

export { updateUI, initCodeDisplay, addCodeToDisplay, animateClick };