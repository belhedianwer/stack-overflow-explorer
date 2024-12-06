/**
 * Animation utilities for the Stack Overflow Explorer extension
 * Provides functions for confetti, fade out animations, and toast notifications
 */

import confetti from './confetti.js';

/**
 * Displays a confetti animation at the specified coordinates
 * @param {Object} params - The parameters for the confetti animation
 * @param {number} params.x - The x coordinate for the confetti origin
 * @param {number} params.y - The y coordinate for the confetti origin
 */
export function showConfetti({ x, y }) {
    confetti({
        particleCount: 30,
        origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight
        },
        colors: ['#f48024', '#0077cc', '#5eba7d', '#ff7b72']
    });
}

/**
 * Fades out an element and removes it from the DOM
 * @param {HTMLElement} element - The element to fade out
 * @param {Function} [onComplete] - Callback function to execute after the animation
 */
export function fadeOutElement(element, onComplete) {
    element.style.transition = 'opacity 0.3s ease-out';
    element.style.opacity = '0';

    setTimeout(() => {
        element.remove();
        if (onComplete) onComplete();
    }, 300);
}

/**
 * Shows a toast notification with the specified message
 * The toast will automatically disappear after a few seconds
 * @param {string} message - The message to display in the toast
 */
export function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger reflow to enable animation
    toast.offsetHeight;

    // Show toast
    toast.classList.add('show');

    // Remove toast after animation
    setTimeout(() => {
        fadeOutElement(toast);
    }, 3000);
}