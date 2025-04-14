import 'howler';
import { generateRandomCodeLine, getRandomCodeColor } from './utility.js';
import { createClickText, createPurchaseAnimation } from './clickAnimations.js';
import { formatNumber } from './numberFormatter.js';
import { initializeVisualEffects, createScreenFlash, applyScreenShake } from './postEffects.js';
import { initializeKeyboard, simulateTypingBurst } from './keyboard.js';
import { initializePixelPerfect } from './pixelPerfect.js';

// Make game state available to other modules
window.gameState = {
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

// Using the window.gameState for shorter reference
const gameState = window.gameState;

// Sound effects using Howler.js
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

// Game setup
function initGame() {
    setupShopItems();
    setupEventListeners();
    loadGame();
    initCodeDisplay();
    startGameLoop();
}

// Define all the shop items
function setupShopItems() {
    // Upgrades that increase lines per click
    gameState.upgrades = [
        {
            id: 'better-keyboard',
            title: 'Better Keyboard',
            description: 'Type faster! +1 line per click',
            baseCost: 10,
            costMultiplier: 1.5,
            effect: { linesPerClick: 1 },
            level: 0,
            maxLevel: 10,
            icon: generateKeyboardSVG()
        },
        {
            id: 'coffee',
            title: 'Coffee Machine',
            description: 'Stay awake! +2 lines per click',
            baseCost: 50,
            costMultiplier: 1.8,
            effect: { linesPerClick: 2 },
            level: 0,
            maxLevel: 5,
            icon: generateCoffeeSVG()
        },
        {
            id: 'autocomplete',
            title: 'Autocomplete',
            description: 'Code suggestions! +5 lines per click',
            baseCost: 200,
            costMultiplier: 2,
            effect: { linesPerClick: 5 },
            level: 0,
            maxLevel: 3,
            icon: generateAutocompleteSVG()
        }
    ];
    
    // Programmers who generate lines automatically
    gameState.programmers = [
        {
            id: 'intern',
            title: 'Intern',
            description: 'Generates 0.5 lines per second',
            baseCost: 15,
            costMultiplier: 1.2,
            effect: { linesPerSecond: 0.5 },
            level: 0,
            icon: generateProgrammerSVG('#8BC34A')
        },
        {
            id: 'junior-dev',
            title: 'Junior Developer',
            description: 'Generates 1 line per second',
            baseCost: 100,
            costMultiplier: 1.3,
            effect: { linesPerSecond: 1 },
            level: 0,
            icon: generateProgrammerSVG('#2196F3')
        },
        {
            id: 'senior-dev',
            title: 'Senior Developer',
            description: 'Generates 5 lines per second',
            baseCost: 1100,
            costMultiplier: 1.4,
            effect: { linesPerSecond: 5 },
            level: 0,
            icon: generateProgrammerSVG('#FF5722')
        }
    ];
    
    // Office upgrades that provide various bonuses
    gameState.officeUpgrades = [
        {
            id: 'better-monitors',
            title: 'Better Monitors',
            description: 'All programmers work 25% faster',
            baseCost: 500,
            costMultiplier: 3,
            effect: { programmerMultiplier: 0.25 },
            level: 0,
            maxLevel: 2,
            icon: generateMonitorSVG()
        },
        {
            id: 'code-optimization',
            title: 'Code Optimization',
            description: 'Each line of code worth 50% more cash',
            baseCost: 1000,
            costMultiplier: 5,
            effect: { cashPerLineMultiplier: 0.5 },
            level: 0,
            maxLevel: 3,
            icon: generateOptimizationSVG()
        }
    ];

    renderShop();
}

// Event listeners
function setupEventListeners() {
    // Computer click event
    document.getElementById('computer').addEventListener('click', handleComputerClick);
    
    // Shop item click
    document.querySelectorAll('.shop-item').forEach(item => {
        item.addEventListener('click', handleShopItemClick);
    });
}

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

// Handle buying shop items
function handleShopItemClick(event) {
    const itemElement = event.currentTarget;
    const itemId = itemElement.dataset.id;
    const itemType = itemElement.dataset.type;
    
    // Find the item in the appropriate array
    let item;
    if (itemType === 'upgrade') {
        item = gameState.upgrades.find(u => u.id === itemId);
    } else if (itemType === 'programmer') {
        item = gameState.programmers.find(p => p.id === itemId);
    } else if (itemType === 'office') {
        item = gameState.officeUpgrades.find(o => o.id === itemId);
    }
    
    if (!item) return;
    
    // Calculate the cost for the next level
    const cost = Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.level));
    
    // Check if we can afford it
    if (gameState.cash >= cost) {
        // Subtract the cost
        gameState.cash -= cost;
        
        // Increment the level
        item.level++;
        
        // Apply the effects
        applyItemEffects(item, itemType);
        
        // Play sound effect
        if (gameState.settings.soundEnabled) {
            sounds.purchase.play();
        }
        
        // Add notification
        addNotification(`Purchased ${item.title}!`);
        
        // Visual purchase effects
        createPurchaseAnimation(itemElement);
        createScreenFlash('rgba(255, 255, 100, 0.2)');
        applyScreenShake(3, 200);
        
        // Update the UI
        updateUI();
        renderShop();
        saveGame();
    }
}

// Apply the effects of purchased items
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

// Recalculate the total lines per second based on programmers and multipliers
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

// Update shop item states based on current cash
function updateShopItemStates() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const itemId = item.dataset.id;
        const itemType = item.dataset.type;
        
        // Find the item in the appropriate array
        let shopItem;
        if (itemType === 'upgrade') {
            shopItem = gameState.upgrades.find(u => u.id === itemId);
        } else if (itemType === 'programmer') {
            shopItem = gameState.programmers.find(p => p.id === itemId);
        } else if (itemType === 'office') {
            shopItem = gameState.officeUpgrades.find(o => o.id === itemId);
        }
        
        if (!shopItem) return;
        
        // Calculate the cost for the next level
        const cost = Math.floor(shopItem.baseCost * Math.pow(shopItem.costMultiplier, shopItem.level));
        
        // Check if max level reached
        const maxLevelReached = shopItem.maxLevel !== undefined && shopItem.level >= shopItem.maxLevel;
        
        // Update disabled state
        if (maxLevelReached) {
            item.classList.add('disabled');
            item.title = "Maximum level reached";
        } else if (gameState.cash < cost) {
            item.classList.add('disabled');
            item.title = "Not enough cash";
        } else {
            item.classList.remove('disabled');
            item.title = "";
        }
    });
}

// Update the UI with current values
function updateUI() {
    document.getElementById('lines').textContent = formatNumber(gameState.lines);
    document.getElementById('lps').textContent = formatNumber(gameState.linesPerSecond, true);
    document.getElementById('cash').textContent = formatNumber(gameState.cash);
    updateShopItemStates(); // Also update shop item states when UI is updated
}

// Render the shop items
function renderShop() {
    renderItemsSection('upgrades', gameState.upgrades, 'upgrade');
    renderItemsSection('programmers', gameState.programmers, 'programmer');
    renderItemsSection('office-upgrades', gameState.officeUpgrades, 'office');
}

function renderItemsSection(containerId, items, itemType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    items.forEach(item => {
        const cost = Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.level));
        const canAfford = gameState.cash >= cost;
        const maxLevelReached = item.maxLevel !== undefined && item.level >= item.maxLevel;
        
        const shopItem = document.createElement('div');
        shopItem.className = `shop-item ${!canAfford || maxLevelReached ? 'disabled' : ''}`;
        shopItem.dataset.id = item.id;
        shopItem.dataset.type = itemType;
        
        let levelDisplay = '';
        if (itemType === 'programmer') {
            levelDisplay = item.level > 0 ? `<div class="shop-item-level">Level ${item.level}</div>` : '';
        } else {
            levelDisplay = item.level > 0 ? `<div class="shop-item-level">${item.level}/${item.maxLevel || '∞'}</div>` : '';
        }
        
        shopItem.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-details">
                <div class="shop-item-title">${item.title}</div>
                <div class="shop-item-description">${item.description}</div>
            </div>
            <div class="shop-item-cost">$${formatNumber(cost)}</div>
            ${levelDisplay}
        `;
        
        if (maxLevelReached) {
            shopItem.title = "Maximum level reached";
        } else if (!canAfford) {
            shopItem.title = "Not enough cash";
        }
        
        container.appendChild(shopItem);
        
        shopItem.addEventListener('click', handleShopItemClick);
    });
}

// Add a notification message
function addNotification(message) {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    container.appendChild(notification);
    
    if (gameState.settings.soundEnabled) {
        sounds.notification.play();
    }
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Visual feedback when clicking
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

// Code display simulation
function initCodeDisplay() {
    addCodeToDisplay(20); // Add some initial code
}

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

// Save and Load functions
function saveGame() {
    const saveData = JSON.stringify(gameState);
    localStorage.setItem('8bitProgrammingClicker', saveData);
}

function loadGame() {
    const savedGame = localStorage.getItem('8bitProgrammingClicker');
    if (savedGame) {
        try {
            const savedState = JSON.parse(savedGame);
            
            // Merge saved state with default gameState to handle new properties
            Object.assign(gameState, savedState);
            
            // Recalculate derived values
            recalculateLinesPerSecond();
            
            // Update the UI
            updateUI();
            renderShop();
            
            addNotification("Game loaded successfully!");
        } catch (e) {
            console.error("Error loading saved game:", e);
        }
    }
}

// SVG Generator functions
function generateKeyboardSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="4" y="8" width="24" height="16" fill="#333"/><rect x="6" y="10" width="20" height="12" fill="#555"/><rect x="8" y="12" width="2" height="2" fill="#777"/><rect x="12" y="12" width="2" height="2" fill="#777"/><rect x="16" y="12" width="2" height="2" fill="#777"/><rect x="20" y="12" width="2" height="2" fill="#777"/><rect x="8" y="16" width="2" height="2" fill="#777"/><rect x="12" y="16" width="2" height="2" fill="#777"/><rect x="16" y="16" width="2" height="2" fill="#777"/><rect x="20" y="16" width="2" height="2" fill="#777"/></svg>`;
}

function generateCoffeeSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="10" y="6" width="12" height="4" fill="#6D4C41"/><rect x="10" y="10" width="14" height="14" fill="#8D6E63"/><rect x="12" y="12" width="10" height="10" fill="#A1887F"/><rect x="8" y="14" width="2" height="8" fill="#6D4C41"/><rect x="14" y="8" width="4" height="2" fill="#FFFFFF" fill-opacity="0.3"/></svg>`;
}

function generateAutocompleteSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="6" y="6" width="20" height="20" fill="#37474F"/><rect x="8" y="8" width="16" height="16" fill="#455A64"/><rect x="10" y="10" width="12" height="2" fill="#90CAF9"/><rect x="10" y="14" width="8" height="2" fill="#FFCC80"/><rect x="10" y="18" width="10" height="2" fill="#A5D6A7"/></svg>`;
}

function generateProgrammerSVG(color = '#FFC107') {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="12" y="6" width="8" height="8" fill="#FFDDC1"/><rect x="10" y="14" width="12" height="10" fill="${color}"/><rect x="8" y="18" width="4" height="2" fill="#795548"/><rect x="20" y="18" width="4" height="2" fill="#795548"/><rect x="14" y="24" width="4" height="4" fill="#795548"/><rect x="16" y="10" width="2" height="2" fill="#333"/><rect x="12" y="10" width="2" height="2" fill="#333"/></svg>`;
}

function generateMonitorSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="8" y="6" width="16" height="14" fill="#37474F"/><rect x="10" y="8" width="12" height="10" fill="#263238"/><rect x="12" y="20" width="8" height="6" fill="#37474F"/><rect x="10" y="26" width="12" height="2" fill="#455A64"/><rect x="12" y="10" width="8" height="2" fill="#4CAF50"/><rect x="12" y="14" width="8" height="2" fill="#2196F3"/></svg>`;
}

function generateOptimizationSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="6" y="12" width="20" height="8" fill="#263238"/><rect x="8" y="14" width="16" height="4" fill="#37474F"/><rect x="12" y="6" width="2" height="6" fill="#F44336"/><rect x="18" y="6" width="2" height="6" fill="#4CAF50"/><rect x="12" y="20" width="2" height="6" fill="#2196F3"/><rect x="18" y="20" width="2" height="6" fill="#FFC107"/><rect x="10" y="8" width="12" height="2" fill="#455A64"/><rect x="10" y="22" width="12" height="2" fill="#455A64"/></svg>`;
}

// Initialize the game when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    initializeVisualEffects();
    initializeKeyboard();
    initializePixelPerfect();
});