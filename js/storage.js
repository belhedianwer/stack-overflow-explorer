/**
 * StorageManager handles all local storage operations for the Stack Overflow Explorer extension.
 * It manages two main types of data:
 * 1. Recent searches - Keeps track of the user's last 10 search queries
 * 2. Favorites - Stores the user's favorite Stack Overflow answers
 */
export class StorageManager {
    constructor() {
        // Storage keys for different data types
        this.RECENT_KEY = 'recent_searches';
        this.FAVORITES_KEY = 'favorites';
    }

    /**
     * Retrieves the list of recent searches from local storage
     * @returns {Promise<Array>} Array of recent search items
     */
    async getRecent() {
        return this.getData(this.RECENT_KEY);
    }

    /**
     * Retrieves the list of favorite answers from local storage
     * @returns {Promise<Array>} Array of favorite items
     */
    async getFavorites() {
        return this.getData(this.FAVORITES_KEY);
    }

    /**
     * Adds a new item to recent searches, maintaining only the 10 most recent unique items
     * @param {Object} item - The search item to add to recent searches
     */
    async addToRecent(item) {
        const recent = await this.getRecent();
        const updated = [item, ...recent.filter(i => i.id !== item.id)].slice(0, 10);
        await this.setData(this.RECENT_KEY, updated);
    }

    /**
     * Toggles the favorite status of an item. If the item exists in favorites, it will be removed.
     * If it doesn't exist, it will be added.
     * @param {Object} item - The item to toggle in favorites
     * @returns {Promise<boolean>} True if item was added to favorites, false if removed
     */
    async toggleFavorite(item) {
        const favorites = await this.getFavorites();
        const exists = favorites.some(f => f.id === item.id);
        
        if (exists) {
            await this.setData(this.FAVORITES_KEY, 
                favorites.filter(f => f.id !== item.id));
            return false;
        } else {
            await this.setData(this.FAVORITES_KEY, 
                [item, ...favorites]);
            return true;
        }
    }

    /**
     * Checks if an item is currently in the favorites list
     * @param {string} id - The ID of the item to check
     * @returns {Promise<boolean>} True if the item is favorited, false otherwise
     */
    async isFavorite(id) {
        const favorites = await this.getFavorites();
        return favorites.some(f => f.id === id);
    }

    /**
     * Helper method to retrieve data from Chrome's local storage
     * @param {string} key - The storage key to retrieve data from
     * @returns {Promise<Array>} The data stored under the key, or an empty array if none exists
     */
    async getData(key) {
        return new Promise(resolve => {
            chrome.storage.local.get(key, result => {
                resolve(result[key] || []);
            });
        });
    }

    /**
     * Helper method to save data to Chrome's local storage
     * @param {string} key - The storage key to save data under
     * @param {Array} data - The data to save
     * @returns {Promise<void>} Promise that resolves when the data is saved
     */
    async setData(key, data) {
        return new Promise(resolve => {
            chrome.storage.local.set({ [key]: data }, resolve);
        });
    }
}