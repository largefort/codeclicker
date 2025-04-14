/**
 * Utility functions for ensuring pixel perfect rendering
 */

/**
 * Ensure all pixel sizes in elements follow the pixel grid
 */
export function initializePixelPerfect() {
    const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
    
    // Apply pixel perfect positioning to all elements that need it
    alignElementsToPixelGrid(pixelSize);
    
    // Set up a resize listener to realign elements when window resizes
    window.addEventListener('resize', () => {
        alignElementsToPixelGrid(pixelSize);
    });
}

/**
 * Align elements to the pixel grid to avoid sub-pixel rendering
 * @param {number} pixelSize - The base pixel size
 */
function alignElementsToPixelGrid(pixelSize) {
    // Align floating text
    document.querySelectorAll('.floating-text').forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = Math.round(rect.left / pixelSize) * pixelSize;
        const y = Math.round(rect.top / pixelSize) * pixelSize;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    });
    
    // Align particles
    document.querySelectorAll('.particle').forEach(el => {
        const rect = el.getBoundingClientRect();
        // Only align width/height to maintain smooth movement
        const width = Math.max(pixelSize, Math.round(rect.width / pixelSize) * pixelSize);
        const height = Math.max(pixelSize, Math.round(rect.height / pixelSize) * pixelSize);
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
    });
    
    // Align computer and elements within
    const computer = document.getElementById('computer');
    if (computer) {
        // Round dimensions to pixel grid
        const computerWidth = Math.round(computer.offsetWidth / pixelSize) * pixelSize;
        const computerHeight = Math.round(computer.offsetHeight / pixelSize) * pixelSize;
        computer.style.width = `${computerWidth}px`;
        computer.style.height = `${computerHeight}px`;
    }
}

/**
 * Creates a pixel perfect SVG icon
 * @param {number} size - Size of the icon in pixels 
 * @param {Function} drawFn - Function that draws the pixel art
 * @returns {string} SVG string
 */
export function createPixelArtSVG(size, drawFn) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('class', 'pixel-art');
    
    // Call drawing function to populate the SVG
    drawFn(svg);
    
    return svg.outerHTML;
}

/**
 * Round a position to the nearest pixel grid point
 * @param {number} position - The position to round
 * @returns {number} Position aligned to pixel grid
 */
export function snapToPixelGrid(position) {
    const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
    return Math.round(position / pixelSize) * pixelSize;
}