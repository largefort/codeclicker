/**
 * SVG Generator functions for game icons
 */

/**
 * Generate an SVG of a keyboard
 * @returns {string} SVG markup
 */
function generateKeyboardSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="4" y="8" width="24" height="16" fill="#333"/><rect x="6" y="10" width="20" height="12" fill="#555"/><rect x="8" y="12" width="2" height="2" fill="#777"/><rect x="12" y="12" width="2" height="2" fill="#777"/><rect x="16" y="12" width="2" height="2" fill="#777"/><rect x="20" y="12" width="2" height="2" fill="#777"/><rect x="8" y="16" width="2" height="2" fill="#777"/><rect x="12" y="16" width="2" height="2" fill="#777"/><rect x="16" y="16" width="2" height="2" fill="#777"/><rect x="20" y="16" width="2" height="2" fill="#777"/></svg>`;
}

/**
 * Generate an SVG of a coffee cup
 * @returns {string} SVG markup
 */
function generateCoffeeSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="10" y="6" width="12" height="4" fill="#6D4C41"/><rect x="10" y="10" width="14" height="14" fill="#8D6E63"/><rect x="12" y="12" width="10" height="10" fill="#A1887F"/><rect x="8" y="14" width="2" height="8" fill="#6D4C41"/><rect x="14" y="8" width="4" height="2" fill="#FFFFFF" fill-opacity="0.3"/></svg>`;
}

/**
 * Generate an SVG of an autocomplete suggestion
 * @returns {string} SVG markup
 */
function generateAutocompleteSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="6" y="6" width="20" height="20" fill="#37474F"/><rect x="8" y="8" width="16" height="16" fill="#455A64"/><rect x="10" y="10" width="12" height="2" fill="#90CAF9"/><rect x="10" y="14" width="8" height="2" fill="#FFCC80"/><rect x="10" y="18" width="10" height="2" fill="#A5D6A7"/></svg>`;
}

/**
 * Generate an SVG of a programmer
 * @param {string} color - Color for the programmer's shirt
 * @returns {string} SVG markup
 */
function generateProgrammerSVG(color = '#FFC107') {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="12" y="6" width="8" height="8" fill="#FFDDC1"/><rect x="10" y="14" width="12" height="10" fill="${color}"/><rect x="8" y="18" width="4" height="2" fill="#795548"/><rect x="20" y="18" width="4" height="2" fill="#795548"/><rect x="14" y="24" width="4" height="4" fill="#795548"/><rect x="16" y="10" width="2" height="2" fill="#333"/><rect x="12" y="10" width="2" height="2" fill="#333"/></svg>`;
}

/**
 * Generate an SVG of a monitor
 * @returns {string} SVG markup
 */
function generateMonitorSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="8" y="6" width="16" height="14" fill="#37474F"/><rect x="10" y="8" width="12" height="10" fill="#263238"/><rect x="12" y="20" width="8" height="6" fill="#37474F"/><rect x="10" y="26" width="12" height="2" fill="#455A64"/><rect x="12" y="10" width="8" height="2" fill="#4CAF50"/><rect x="12" y="14" width="8" height="2" fill="#2196F3"/></svg>`;
}

/**
 * Generate an SVG of a code optimization icon
 * @returns {string} SVG markup
 */
function generateOptimizationSVG() {
    return `<svg viewBox="0 0 32 32" class="pixel-art"><rect x="6" y="12" width="20" height="8" fill="#263238"/><rect x="8" y="14" width="16" height="4" fill="#37474F"/><rect x="12" y="6" width="2" height="6" fill="#F44336"/><rect x="18" y="6" width="2" height="6" fill="#4CAF50"/><rect x="12" y="20" width="2" height="6" fill="#2196F3"/><rect x="18" y="20" width="2" height="6" fill="#FFC107"/><rect x="10" y="8" width="12" height="2" fill="#455A64"/><rect x="10" y="22" width="12" height="2" fill="#455A64"/></svg>`;
}

export {
    generateKeyboardSVG,
    generateCoffeeSVG,
    generateAutocompleteSVG,
    generateProgrammerSVG,
    generateMonitorSVG,
    generateOptimizationSVG
};