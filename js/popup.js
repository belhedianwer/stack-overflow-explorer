/**
 * Main popup manager for the Stack Overflow Explorer extension
 * Handles the core functionality of the popup interface
 */

import { searchStackOverflow } from './api.js';
import { StorageManager } from './storage.js';
import { UIManager } from './ui.js';
import { StateManager } from './state.js';

/**
 * Manages the popup interface and coordinates between different components
 */
class PopupManager {
    /**
     * Initializes the popup manager and its dependencies
     */
    constructor() {
        this.stateManager = new StateManager();
        this.storage = new StorageManager();
        this.ui = new UIManager(this.stateManager);
        this.ui.storage = this.storage;
        this.resultContainer = document.getElementById('result');
        this.init();
    }

    /**
     * Initializes the popup by setting up event listeners and clearing initial state
     */
    init() {
        this.setupEventListeners();
        
        // Clear results when popup opens
        this.clearResults();
        
        // Clear results when popup closes
        window.addEventListener('unload', () => {
            this.clearResults();
        });
    }

    /**
     * Sets up all event listeners for the popup interface
     */
    setupEventListeners() {
        // Search button and Enter key handling
        document.getElementById('searchButton').addEventListener('click', () => this.handleSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.handleTabChange(e));
        });

        // Favorite toggling
        document.addEventListener('toggleFavorite', async (e) => {
            const { id, result } = e.detail;
            await this.storage.toggleFavorite(result);
        });
    }

    /**
     * Handles the search action when user submits a query
     */
    async handleSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) return;

        try {
            this.ui.showLoading();
            const results = await searchStackOverflow(query);
            this.stateManager.setActiveSearch(true);
            await this.ui.displayResults(results, 'result');
            if (results.length > 0) {
                await this.storage.addToRecent(results[0]);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.ui.showError('An error occurred during search');
        } finally {
            this.ui.hideLoading();
        }
    }

    /**
     * Handles tab changes between Results and Favorites
     * @param {Event} event - The tab change event
     */
    handleTabChange(event) {
        const tabName = event.target.dataset.tab;
        this.ui.switchTab(tabName);
        
        if (tabName === 'result') {
            // If returning to results tab and there are results, display them
            if (this.stateManager.hasResults()) {
                this.ui.displayResults(this.stateManager.getResults(), 'result');
            }
        } else {
            this.loadTabContent(tabName);
        }
    }

    /**
     * Loads content for the selected tab
     * @param {string} tabName - Name of the tab to load content for
     */
    async loadTabContent(tabName) {
        try {
            let content;
            switch (tabName) {
                case 'favorites':
                    content = await this.storage.getFavorites();
                    await this.ui.displayResults(content, tabName);
                    break;
            }
        } catch (error) {
            console.error('Error loading content:', error);
            this.ui.showError('An error occurred while loading content, try again later !');
        }
    }

    /**
     * Clears search results and resets the interface
     */
    clearResults() {
        const resultContainer = document.getElementById('result');
        if (resultContainer) {
            resultContainer.innerHTML = '';
        }
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.stateManager.clearResults();
    }
}

// Initialize the popup manager when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});