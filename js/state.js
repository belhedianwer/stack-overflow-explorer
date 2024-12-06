/**
 * Manages the application state for the Stack Overflow Explorer
 * Handles search results and active search state
 */
export class StateManager {
    /**
     * Initializes the state manager
     */
    constructor() {
        this.currentResults = new Map();
        this.activeSearch = false;
    }

    /**
     * Sets the current search results
     * @param {Array} results - Array of search result objects
     */
    setResults(results) {
        this.currentResults.clear();
        results.forEach(result => this.currentResults.set(result.id, result));
    }

    /**
     * Gets all current search results
     * @returns {Array} Array of search result objects
     */
    getResults() {
        return Array.from(this.currentResults.values());
    }

    /**
     * Clears all current search results
     */
    clearResults() {
        this.currentResults.clear();
    }

    /**
     * Checks if there are any search results
     * @returns {boolean} True if there are results, false otherwise
     */
    hasResults() {
        return this.currentResults.size > 0;
    }

    /**
     * Sets the active search state
     * @param {boolean} active - Whether there is an active search
     */
    setActiveSearch(active) {
        this.activeSearch = active;
    }

    /**
     * Checks if there is an active search
     * @returns {boolean} True if there is an active search, false otherwise
     */
    hasActiveSearch() {
        return this.activeSearch;
    }
}