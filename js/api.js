/**
 * Stack Overflow API integration module
 * Provides functions to interact with the Stack Exchange API
 */

/** Base URL for the Stack Exchange API */
const API_BASE_URL = 'https://api.stackexchange.com/2.3';

/**
 * Searches Stack Overflow for questions matching the query
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of question objects with normalized properties
 * @throws {Error} If the API request fails
 */
export async function searchStackOverflow(query) {
    // Set up search parameters
    const params = new URLSearchParams({
        site: 'stackoverflow',
        order: 'desc',
        sort: 'relevance',  // Changed to relevance for better results
        q: query,           // Using 'q' instead of 'intitle' for full text search
        filter: 'withbody',
        pagesize: 20
    });

    const url = `${API_BASE_URL}/search/advanced?${params}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Network error');
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            console.log('No results found for query:', query);
            return [];
        }

        return data.items.map(item => ({
            id: item.question_id,
            title: item.title,
            link: item.link,
            score: item.score,
            answerCount: item.answer_count,
            timestamp: item.creation_date,
            tags: item.tags
        }));
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Failed to fetch results');
    }
}