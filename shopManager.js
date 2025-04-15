import { gameState, applyItemEffects, recalculateLinesPerSecond } from './gameState.js';
import { createPurchaseAnimation } from './clickAnimations.js';
import { formatNumber } from './numberFormatter.js';
import { createScreenFlash, applyScreenShake } from './postEffects.js';
import { addNotification } from './saveManager.js';
import { 
    generateKeyboardSVG, 
    generateCoffeeSVG, 
    generateAutocompleteSVG, 
    generateProgrammerSVG,
    generateMonitorSVG, 
    generateOptimizationSVG
} from './svgGenerator.js';

/**
 * Set up all shop items
 */
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

/**
 * Handle buying shop items
 * @param {Event} event - The click event
 */
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
            window.sounds.purchase.play();
        }
        
        // Add notification
        addNotification(`Purchased ${item.title}!`);
        
        // Visual purchase effects
        createPurchaseAnimation(itemElement);
        createScreenFlash('rgba(255, 255, 100, 0.2)');
        applyScreenShake(3, 200);
        
        // Update the UI
        import('./gameState.js').then(({ updateUI }) => {
            updateUI();
        });
        
        renderShop();
        import('./gameState.js').then(({ saveGame }) => {
            saveGame();
        });
    }
}

/**
 * Render all shop items sections
 */
function renderShop() {
    renderItemsSection('upgrades', gameState.upgrades, 'upgrade');
    renderItemsSection('programmers', gameState.programmers, 'programmer');
    renderItemsSection('office-upgrades', gameState.officeUpgrades, 'office');
}

/**
 * Render a single section of shop items
 * @param {string} containerId - ID of the container element
 * @param {Array} items - Array of items to render
 * @param {string} itemType - Type of items (upgrade, programmer, office)
 */
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

/**
 * Update shop item states based on current cash
 */
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

export { setupShopItems, renderShop, updateShopItemStates, handleShopItemClick };