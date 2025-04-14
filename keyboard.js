/**
 * Functions for managing the virtual keyboard visuals
 */

// State tracking for keyboard animation
let keyboardState = {
    lastKeyPressed: null,
    typingInterval: null,
    keyLayout: [
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm,./'
    ]
};

/**
 * Initialize the visual keyboard
 */
export function initializeKeyboard() {
    renderKeyboard();
    setupKeyboardAnimation();
}

/**
 * Render the keyboard keys in the DOM
 */
function renderKeyboard() {
    const keyboard = document.querySelector('.computer-keyboard');
    keyboard.innerHTML = '';
    
    // Create all the keys
    keyboardState.keyLayout.forEach(row => {
        for (let i = 0; i < row.length; i++) {
            const key = document.createElement('div');
            key.className = 'keyboard-key';
            key.dataset.key = row[i];
            // Add visible key label
            key.textContent = row[i];
            keyboard.appendChild(key);
        }
    });
}

/**
 * Setup animations for keyboard typing
 */
function setupKeyboardAnimation() {
    // Clear any existing interval
    if (keyboardState.typingInterval) {
        clearInterval(keyboardState.typingInterval);
    }
    
    // Start new typing simulation
    keyboardState.typingInterval = setInterval(() => {
        // Only animate if we have programmers working
        if (window.gameState && 
            window.gameState.programmers && 
            window.gameState.programmers.some(p => p.level > 0)) {
            simulateRandomKeypress();
        }
    }, 200); // Keyboard animation rate
}

/**
 * Simulate a random keypress animation
 */
function simulateRandomKeypress() {
    // Reset previous key
    if (keyboardState.lastKeyPressed) {
        const prevKey = document.querySelector(`.keyboard-key[data-key="${keyboardState.lastKeyPressed}"]`);
        if (prevKey) prevKey.classList.remove('pressed');
    }
    
    // Select a row and then a key within that row
    const rowIndex = Math.floor(Math.random() * keyboardState.keyLayout.length);
    const row = keyboardState.keyLayout[rowIndex];
    const keyIndex = Math.floor(Math.random() * row.length);
    const keyChar = row[keyIndex];
    
    // Highlight the key
    const keyElement = document.querySelector(`.keyboard-key[data-key="${keyChar}"]`);
    if (keyElement) {
        keyElement.classList.add('pressed');
        keyboardState.lastKeyPressed = keyChar;
    }
    
    // Duration-based typing speed based on programmer count
    const programmerCount = window.gameState ? 
        window.gameState.programmers.reduce((total, p) => total + p.level, 0) : 0;
    
    // More programmers = faster typing reset
    const resetTime = Math.max(50, 150 - (programmerCount * 5));
    
    setTimeout(() => {
        if (keyElement) keyElement.classList.remove('pressed');
    }, resetTime);
}

/**
 * Trigger typing animation when the computer is clicked
 */
export function simulateTypingBurst() {
    // Simulate 3-5 rapid keypresses
    const keypressCount = 3 + Math.floor(Math.random() * 3);
    let delay = 0;
    
    for (let i = 0; i < keypressCount; i++) {
        setTimeout(simulateRandomKeypress, delay);
        delay += 50 + Math.random() * 50; // Random timing between keypresses
    }
}