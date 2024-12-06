/**
 * UI Manager for Stack Overflow Explorer
 * Handles all UI-related operations including rendering results and handling user interactions
 */

import { showConfetti, fadeOutElement, showToast } from './animations.js';

export class UIManager {
    /**
     * Initializes the UI manager
     * @param {StateManager} stateManager - The application state manager
     */
    constructor(stateManager) {
        this.resultContainer = document.getElementById('result');
        this.stateManager = stateManager;
        this.setupEventListeners();
    }

    /**
     * Shows the loading spinner while fetching results
     */
    showLoading() {
        const loadingHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <span>Searching...</span>
            </div>`;
        this.resultContainer.innerHTML = loadingHTML;
    }

    /**
     * Hides the loading spinner
     */
    hideLoading() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    /**
     * Sets up event listeners for UI interactions
     */
    setupEventListeners() {
        document.addEventListener('click', async (e) => {
            // Handle favorite button clicks
            if (e.target.classList.contains('favorite-btn')) {
                const resultItem = e.target.closest('.result-item');
                if (resultItem) {
                    const id = parseInt(resultItem.dataset.id);
                    const result = this.getResultData(resultItem);
                    const event = new CustomEvent('toggleFavorite', {
                        detail: { id, result }
                    });
                    document.dispatchEvent(event);

                    // Update button state immediately
                    const wasActive = e.target.classList.contains('active');
                    if (!wasActive) {
                        e.target.classList.add('active');
                        e.target.textContent = '⭐';
                        e.target.title = 'Remove from favorites';
                        
                        // Show confetti animation when adding to favorites
                        const rect = e.target.getBoundingClientRect();
                        const x = (rect.left + rect.right) / 2;
                        const y = (rect.top + rect.bottom) / 2;
                        showConfetti({ x, y });
                    } else {
                        e.target.classList.remove('active');
                        e.target.textContent = '★';
                        e.target.title = 'Add to favorites';
                        
                        // Handle removal animation in favorites tab
                        if (document.getElementById('favorites').classList.contains('active')) {
                            fadeOutElement(resultItem, () => {
                                if (!document.querySelector('#favorites .result-item')) {
                                    document.getElementById('favorites').innerHTML = '<p>No favorites yet</p>';
                                }
                            });
                        }
                    }
                }
            } 
            // Handle share button clicks
            else if (e.target.classList.contains('share-btn')) {
                const link = e.target.dataset.link;
                await navigator.clipboard.writeText(link);
                showToast('Link copied!');
            }
        });
    }

    /**
     * Extracts result data from a result item element
     * @param {HTMLElement} resultItem - The result item element
     * @returns {Object} The result data object
     */
    getResultData(resultItem) {
        return {
            id: parseInt(resultItem.dataset.id),
            title: resultItem.querySelector('.result-title').textContent,
            link: resultItem.querySelector('.result-title').href,
            score: parseInt(resultItem.querySelector('.score').dataset.score),
            answerCount: parseInt(resultItem.querySelector('.answers').dataset.count),
            tags: Array.from(resultItem.querySelectorAll('.tag')).map(tag => tag.textContent)
        };
    }

    /**
     * Displays search results in the specified container
     * @param {Array} results - Array of result objects to display
     * @param {string} container - ID of the container element
     */
    async displayResults(results, container = 'result') {
        this.showLoading();
        const targetContainer = document.getElementById(container);
        
        try {
            if (!results?.length) {
                targetContainer.innerHTML = '<p>No results found</p>';
                return;
            }

            if (container === 'result') {
                this.stateManager.setResults(results);
            }

            const htmlPromises = results.map(result => this.createResultHTML(result));
            const htmlResults = await Promise.all(htmlPromises);
            targetContainer.innerHTML = htmlResults.join('');
        } catch (error) {
            console.error('Error displaying results:', error);
            targetContainer.innerHTML = '<p>Error displaying results</p>';
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Creates HTML for a single result item
     * @param {Object} result - The result object to create HTML for
     * @returns {string} HTML string for the result item
     */
    async createResultHTML(result) {
        const isFavorite = await this.storage?.isFavorite(result.id) || false;
        return `
            <div class="result-item" data-id="${result.id}">
                <a href="${result.link}" target="_blank" class="result-title">
                    ${this.escapeHTML(result.title)}
                </a>
                <div class="result-meta">
                    <span class="score" data-score="${result.score}">
                        <span class="icon">⬆️</span> ${result.score}
                    </span> | 
                    <span class="answers" data-count="${result.answerCount}">
                        <span class="icon">💬</span> ${result.answerCount}
                    </span>
                    <div class="tags">
                        ${result.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                    </div>
                </div>
                <div class="actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFavorite ? '⭐' : '★'}
                    </button>
                    <button class="share-btn" title="Share" data-link="${result.link}">
                        🔗
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Switches between tabs (Results/Favorites)
     * @param {string} tabName - Name of the tab to switch to
     */
    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    /**
     * Shows an error message to the user
     * @param {string} message - The error message to display
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.resultContainer.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    /**
     * Escapes HTML characters in a string
     * @param {string} str - The string to escape
     * @returns {string} The escaped string
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}