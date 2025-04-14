// Utility functions for the 8bit Programming Clicker game

// Code snippets for display
const codeSnippets = [
    "function getRandomInt(max) {",
    "  return Math.floor(Math.random() * max);",
    "}",
    "const app = new App();",
    "app.initialize();",
    "let count = 0;",
    "for (let i = 0; i < 10; i++) {",
    "  count += i;",
    "}",
    "if (condition) {",
    "  doSomething();",
    "}",
    "class Game {",
    "  constructor() {",
    "    this.score = 0;",
    "  }",
    "}",
    "const API_URL = 'https://api.example.com';",
    "async function fetchData() {",
    "  const response = await fetch(API_URL);",
    "  return response.json();",
    "}",
    "// TODO: Fix this hack later",
    "document.addEventListener('click', handleClick);",
    "export default Component;",
    "const data = JSON.parse(localStorage.getItem('data'));",
    "this.setState({ loading: false });",
    "let timer = setTimeout(() => process(), 1000);",
    "import React from 'react';",
    "useEffect(() => { fetchData(); }, []);",
    "const sum = array.reduce((a, b) => a + b, 0);",
    "console.log('Debug:', variable);",
    "element.style.color = 'red';",
    "try { doRiskyOperation(); } catch(e) { handleError(e); }",
    "const square = num => num * num;",
    "Math.max(...numbers);",
    "this.props.dispatch(action());"
];

// Advanced code snippets that appear when you have senior developers
const advancedCodeSnippets = [
    "const memoize = fn => {",
    "  const cache = new Map();",
    "  return (...args) => {",
    "    const key = JSON.stringify(args);",
    "    if (cache.has(key)) return cache.get(key);",
    "    const result = fn(...args);",
    "    cache.set(key, result);",
    "    return result;",
    "  };",
    "};",
    "@Injectable()",
    "export class DataService {",
    "  constructor(private http: HttpClient) {}",
    "  getData(): Observable<any[]> {",
    "    return this.http.get<any[]>(this.apiUrl);",
    "  }",
    "}",
    "async function* generateSequence() {",
    "  for(let i = 0; i < Infinity; i++) {",
    "    yield await Promise.resolve(i);",
    "  }",
    "}",
    "const worker = new Worker('./worker.js');",
    "worker.postMessage({type: 'PROCESS', data});",
    "Object.defineProperty(obj, 'prop', {",
    "  get() { return this._value; },",
    "  set(v) { this._value = v; }",
    "});"
];

/**
 * Generate a random line of code
 * @returns {string} A random code snippet
 */
export function generateRandomCodeLine() {
    // 20% chance to get an advanced code snippet if available
    if (Math.random() < 0.2 && advancedCodeSnippets.length > 0) {
        return advancedCodeSnippets[Math.floor(Math.random() * advancedCodeSnippets.length)];
    }
    return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
}

/**
 * Get a random color for code display
 * @returns {string} A color hex value
 */
export function getRandomCodeColor() {
    const colors = [
        '#00cc00', // green
        '#cccccc', // light gray
        '#9999ff', // light blue
        '#ffff66', // yellow
        '#ff9966'  // orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Format a large number with appropriate prefix (K, M, B, T, etc.)
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export function formatLargeNumber(num) {
    if (num < 1000) return Math.floor(num);
    
    const prefixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const exp = Math.min(Math.floor(Math.log10(num) / 3), prefixes.length - 1);
    
    const formattedNum = (num / Math.pow(1000, exp)).toFixed(1);
    return `${formattedNum}${prefixes[exp]}`;
}