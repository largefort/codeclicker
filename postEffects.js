/**
 * Visual effects and post-processing for the 8bit Programming Clicker game
 */

// Particle system configuration
const PARTICLE_CONFIG = {
  maxParticles: 50,
  colors: ['#00ff00', '#66ff66', '#99ff99', '#ccffcc', '#ffffff'],
  minSize: 2,
  maxSize: 5,
  minSpeed: 30,
  maxSpeed: 80,
  lifetime: 3000, // milliseconds
  gravity: 10
};

// Active particles array
let particles = [];
let lastFrameTime = 0;

/**
 * Initialize all visual effects
 */
export function initializeVisualEffects() {
  setupCrtEffect();
  setupScanlines();
  setupGlowEffect();
  setupPixelatedBackground();
  initParticleSystem();
  setupPowerButtonEffect();
}

/**
 * Setup CRT screen effect overlay
 */
function setupCrtEffect() {
  const gameContainer = document.querySelector('.game-container');
  
  const crtOverlay = document.createElement('div');
  crtOverlay.className = 'crt-overlay';
  gameContainer.appendChild(crtOverlay);

  // Add CSS class to body for global effects
  document.body.classList.add('crt-effect');
}

/**
 * Setup scanlines overlay effect
 */
function setupScanlines() {
  const gameContainer = document.querySelector('.game-container');
  
  const scanlines = document.createElement('div');
  scanlines.className = 'scanlines';
  gameContainer.appendChild(scanlines);
}

/**
 * Setup ambient glow effects
 */
function setupGlowEffect() {
  const computer = document.getElementById('computer');
  const glow = document.createElement('div');
  glow.className = 'computer-glow';
  computer.parentNode.insertBefore(glow, computer);
  computer.parentNode.appendChild(glow);
}

/**
 * Setup animated pixelated background
 */
function setupPixelatedBackground() {
  const gameContainer = document.querySelector('.game-container');
  
  const pixelGrid = document.createElement('div');
  pixelGrid.className = 'pixel-grid';
  gameContainer.appendChild(pixelGrid);
}

/**
 * Setup pulsing power button effect
 */
function setupPowerButtonEffect() {
  const computer = document.getElementById('computer');
  
  const powerButton = document.createElement('div');
  powerButton.className = 'power-button';
  computer.appendChild(powerButton);
  
  setInterval(() => {
    powerButton.classList.add('pulse');
    setTimeout(() => powerButton.classList.remove('pulse'), 500);
  }, 3000);
}

/**
 * Initialize the particle system
 */
function initParticleSystem() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  document.body.appendChild(particleContainer);
  
  // Start animation loop
  requestAnimationFrame(updateParticles);
}

/**
 * Update all active particles
 * @param {number} timestamp - Current animation frame timestamp
 */
function updateParticles(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = (timestamp - lastFrameTime) / 1000; // convert to seconds
  lastFrameTime = timestamp;
  
  // Update existing particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    // Update lifetime
    particle.life -= deltaTime * 1000;
    if (particle.life <= 0) {
      // Remove dead particles
      particle.element.remove();
      particles.splice(i, 1);
      continue;
    }
    
    // Update position with gravity
    particle.ySpeed += PARTICLE_CONFIG.gravity * deltaTime;
    particle.x += particle.xSpeed * deltaTime;
    particle.y += particle.ySpeed * deltaTime;
    
    // Update opacity based on remaining life
    const opacity = particle.life / particle.maxLife;
    
    // Update DOM element
    particle.element.style.left = `${particle.x}px`;
    particle.element.style.top = `${particle.y}px`;
    particle.element.style.opacity = opacity;
  }
  
  requestAnimationFrame(updateParticles);
}

/**
 * Create particles at a specific position
 * @param {number} x - Starting X position
 * @param {number} y - Starting Y position
 * @param {number} count - Number of particles to create
 * @param {string} color - Optional specific color for particles
 */
export function createParticles(x, y, count = 5, color = null) {
  const container = document.querySelector('.particle-container');
  
  for (let i = 0; i < count; i++) {
    if (particles.length >= PARTICLE_CONFIG.maxParticles) {
      // Remove oldest particle if we reached the limit
      const oldest = particles.shift();
      oldest.element.remove();
    }
    
    // Random particle properties
    const size = Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize) + PARTICLE_CONFIG.minSize;
    const life = Math.random() * PARTICLE_CONFIG.lifetime * 0.5 + PARTICLE_CONFIG.lifetime * 0.5;
    const particleColor = color || PARTICLE_CONFIG.colors[Math.floor(Math.random() * PARTICLE_CONFIG.colors.length)];
    
    // Create particle element
    const particleElement = document.createElement('div');
    particleElement.className = 'particle';
    particleElement.style.width = `${size}px`;
    particleElement.style.height = `${size}px`;
    particleElement.style.backgroundColor = particleColor;
    particleElement.style.left = `${x}px`;
    particleElement.style.top = `${y}px`;
    container.appendChild(particleElement);
    
    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (PARTICLE_CONFIG.maxSpeed - PARTICLE_CONFIG.minSpeed) + PARTICLE_CONFIG.minSpeed;
    
    // Add to active particles array
    particles.push({
      element: particleElement,
      x: x,
      y: y,
      xSpeed: Math.cos(angle) * speed,
      ySpeed: Math.sin(angle) * speed - 20, // Initial upward boost
      size: size,
      life: life,
      maxLife: life
    });
  }
}

/**
 * Create a screen flash effect
 * @param {string} color - Flash color in hex format
 * @param {number} duration - Duration in milliseconds
 */
export function createScreenFlash(color = '#ffffff', duration = 300) {
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  flash.style.backgroundColor = color;
  document.body.appendChild(flash);
  
  setTimeout(() => {
    flash.style.opacity = '0';
    setTimeout(() => flash.remove(), duration);
  }, 50);
}

/**
 * Create a shockwave effect at a specific position
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 */
export function createShockwave(x, y) {
  const shockwave = document.createElement('div');
  shockwave.className = 'shockwave';
  shockwave.style.left = `${x}px`;
  shockwave.style.top = `${y}px`;
  document.body.appendChild(shockwave);
  
  // Remove after animation completes
  setTimeout(() => shockwave.remove(), 1000);
}

/**
 * Apply a temporary screen shake effect
 * @param {number} intensity - Shake intensity
 * @param {number} duration - Duration in milliseconds
 */
export function applyScreenShake(intensity = 5, duration = 300) {
  const gameContainer = document.querySelector('.game-container');
  gameContainer.classList.add('screen-shake');
  
  let elapsed = 0;
  const interval = 16;
  const initialTransform = gameContainer.style.transform || '';
  
  const shake = () => {
    if (elapsed >= duration) {
      gameContainer.style.transform = initialTransform;
      gameContainer.classList.remove('screen-shake');
      return;
    }
    
    const xShake = (Math.random() * 2 - 1) * intensity;
    const yShake = (Math.random() * 2 - 1) * intensity;
    gameContainer.style.transform = `${initialTransform} translate(${xShake}px, ${yShake}px)`;
    
    elapsed += interval;
    setTimeout(shake, interval);
  };
  
  shake();
}