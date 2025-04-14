// Animation functions for the 8bit Programming Clicker game
import { createParticles, createScreenFlash, createShockwave } from './postEffects.js';

/**
 * Creates a floating text animation when clicking the computer
 * @param {number} amount - The amount of lines added per click
 */
export function createClickText(amount) {
    const computer = document.getElementById('computer');
    const rect = computer.getBoundingClientRect();
    
    // Create floating text element
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-text';
    floatingText.textContent = `+${amount} lines`;
    
    // Position randomly around the click area
    const randomX = Math.random() * 60 - 30;
    const randomY = Math.random() * 20 - 40;
    
    // Set position and add to document
    floatingText.style.left = `${rect.left + rect.width/2 + randomX}px`;
    floatingText.style.top = `${rect.top + rect.height/2 + randomY}px`;
    document.body.appendChild(floatingText);
    
    // Add particles at click position
    createParticles(rect.left + rect.width/2, rect.top + rect.height/2, amount > 5 ? 10 : 5);
    
    // Remove after animation completes
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1000);
}

/**
 * Enhanced animation when purchasing an upgrade
 * @param {Element} itemElement - The shop item element
 */
export function createPurchaseAnimation(itemElement) {
    const rect = itemElement.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    
    // Create shockwave effect
    createShockwave(centerX, centerY);
    
    // Create particles
    createParticles(centerX, centerY, 15, '#ffcc00');
    
    // Brief screen flash
    createScreenFlash('rgba(255, 200, 0, 0.2)', 300);
    
    // Add pulse animation to the item
    itemElement.classList.add('pulse-animation');
    setTimeout(() => {
        itemElement.classList.remove('pulse-animation');
    }, 500);
}