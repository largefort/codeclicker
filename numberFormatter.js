/**
 * Functions for formatting large numbers in the game
 */

/**
 * Format a number with appropriate prefix (K, M, B, T, etc.)
 * @param {number} num - The number to format
 * @param {boolean} decimal - Whether to include decimal place
 * @returns {string} The formatted number
 */
export function formatNumber(num, decimal = true) {
    if (num < 1000) return Math.floor(num);
    
    const prefixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const exp = Math.min(Math.floor(Math.log10(num) / 3), prefixes.length - 1);
    
    const formattedNum = decimal 
        ? (num / Math.pow(1000, exp)).toFixed(1)
        : Math.floor(num / Math.pow(1000, exp));
        
    // Remove trailing .0 if present
    return `${formattedNum.replace(/\.0$/, '')}${prefixes[exp]}`;
}