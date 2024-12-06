/**
 * Confetti animation module
 * Creates a burst of colorful particles when triggered
 */
// Default configuration
const defaultColors = ['#f48024', '#0077cc', '#5eba7d', '#ff7b72']; // Stack Overflow colors
const shapes = ['circle', 'square'];
const defaultConfettiCount = 30;
const sizeRange = { min: 3, max: 6 };

/**
 * Creates a single confetti particle element
 * @param {string} shape - The shape of the particle ('circle' or 'square')
 * @param {number} size - Size of the particle in pixels
 * @param {string} color - CSS color value
 * @returns {HTMLElement} The created particle element
 */
function createConfettiShape(shape, size, color) {
    const element = document.createElement('div');
    element.style.position = 'fixed';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '9999';
    element.style.willChange = 'transform';
    element.style.width = size + 'px';
    element.style.height = size + 'px';
    element.style.backgroundColor = color;

    if (shape === 'circle') {
        element.style.borderRadius = '50%';
    }

    return element;
}

/**
 * Creates and animates a single confetti particle
 * @param {number} x - Starting X position
 * @param {number} y - Starting Y position
 * @param {string[]} colors - Array of colors to choose from
 */
function createConfetti(x, y, colors) {
    // Create random particle
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const confetti = createConfettiShape(shape, size, color);
    
    // Set initial position
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    document.body.appendChild(confetti);

    // Animation parameters
    const angle = (Math.random() * 360) * Math.PI / 180;
    const velocity = 3 + Math.random() * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.8;
    let rotation = Math.random() * 360;
    let opacity = 1;
    let posX = x;
    let posY = y;
    let time = 0;
    const duration = 1000; // Animation duration in ms

    /**
     * Updates the particle position and properties each frame
     */
    function updatePosition() {
        if (time >= duration || opacity <= 0) {
            confetti.remove();
            return;
        }

        time += 16; // ~60fps
        const progress = time / duration;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out

        // Calculate circular burst pattern
        const radius = velocity * 40 * easeOut;
        posX = x + Math.cos(angle) * radius;
        posY = y + Math.sin(angle) * radius;

        // Add gravity effect
        posY += progress * progress * 30;

        // Update rotation and opacity
        rotation += rotationSpeed;
        opacity = 1 - easeOut;

        // Apply transforms
        confetti.style.transform = `translate3d(${posX - x}px, ${posY - y}px, 0) rotate(${rotation}deg)`;
        confetti.style.opacity = opacity;

        requestAnimationFrame(updatePosition);
    }

    updatePosition();
}

/**
 * Global confetti function exposed to window
 * @param {Object} options - Configuration options
 * @param {string[]} [options.colors] - Array of colors to use
 * @param {number} [options.particleCount] - Number of particles to create
 * @param {Object} [options.origin] - Origin point {x, y} in relative coordinates (0-1)
 */
function confetti(options = {}) {
    const colors = options.colors || defaultColors;
    const count = options.particleCount || defaultConfettiCount;
    const origin = options.origin || { x: 0.5, y: 0.5 };

    const startX = window.innerWidth * origin.x;
    const startY = window.innerHeight * origin.y;

    // Create particles in a quick burst effect
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            createConfetti(
                startX + (Math.random() - 0.5) * 10, // Small random spread
                startY + (Math.random() - 0.5) * 10,
                colors
            );
        }, Math.random() * 100); // Stagger creation for natural effect
    }
}

export default confetti;
