
// Base URL for API
// Use local IP for device testing, localhost for simulator
// Replace with your machine's IP address if running on physical device
const BASE_URL = 'http://127.0.0.1:5001';

// IMPORTANT: This frontend should work with free APIs only
// Backend should use free image sources (Unsplash, placeholder.com, etc.)
// No paid API keys (Google Places, Yelp, etc.) should be required
//

/**
 * Generic API request handler
 * @param {string} endpoint
 * @param {object} options
 * @returns {Promise<{data: any, error: string|null}>}
 */
const apiRequest = async (endpoint, options = {}) => {
    try {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`[API] ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        // Parse response
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            // Handle error response
            const errorMessage = (typeof data === 'object' && data.error) 
                ? data.error 
                : (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
            
            console.error(`[API Error] ${url}: ${errorMessage}`);
            return { data: null, error: errorMessage };
        }

        console.log(`[API Success] ${url}: ${JSON.stringify(data).substring(0, 100)}...`);
        // Backend returns format: { data: ..., message: ... } or just data
        return { data: data.data || data, error: null };
    } catch (error) {
        console.error(`[API Network Error] ${error.message}`);
        return { data: null, error: error.message || 'Network request failed' };
    }
};

// API Services

export const authAPI = {
    /**
     * Sign up a new user
     * @param {string} username
     * @returns {Promise<{data: UserData, error: string|null}>}
     */
    signup: async (username) => {
        return apiRequest('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username }),
        });
    },

    /**
     * Login user
     * @param {string} username
     * @returns {Promise<{data: UserData, error: string|null}>}
     */
    login: async (username) => {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username }),
        });
    },
};

export const lobbyAPI = {
    /**
     * Create a new lobby
     * @param {object} lobbyData
     * @returns {Promise<{data: LobbyData, error: string|null}>}
     */
    create: async (lobbyData) => {
        return apiRequest('/api/lobbies', {
            method: 'POST',
            body: JSON.stringify(lobbyData),
        });
    },

    /**
     * Join an existing lobby
     * @param {string} code
     * @param {string} user_id
     * @returns {Promise<{data: LobbyData, error: string|null}>}
     */
    join: async (code, user_id) => {
        return apiRequest('/api/lobbies/join', {
            method: 'POST',
            body: JSON.stringify({ code, user_id }),
        });
    },

    /**
     * Get lobby status/details
     * @param {string} lobby_id
     * @returns {Promise<{data: LobbyData, error: string|null}>}
     */
    getStatus: async (lobby_id) => {
        return apiRequest(`/api/lobbies/${lobby_id}/status`);
    },

    /**
     * Set member ready status
     * @param {string} lobby_id
     * @param {string} user_id
     * @param {boolean} ready
     * @returns {Promise<{data: status object, error: string|null}>}
     */
    setReady: async (lobby_id, user_id, ready = true) => {
        return apiRequest(`/api/lobbies/${lobby_id}/member/${user_id}/ready`, {
            method: 'POST',
            body: JSON.stringify({ ready }),
        });
    },

    /**
     * Leave current lobby
     * @param {string} user_id
     * @returns {Promise<{data: any, error: string|null}>}
     */
    leave: async (user_id) => {
        return apiRequest(`/api/lobbies/member/${user_id}/leave`, {
            method: 'POST',
        });
    },
};

export const consensusAPI = {
    /**
     * Start the game (host only)
     * @param {string} lobby_id
     * @param {string} user_id
     * @returns {Promise<{data: any, error: string|null}>}
     */
    start: async (lobby_id, user_id) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/start`, {
            method: 'POST',
            body: JSON.stringify({ user_id }),
        });
    },

    /**
     * Get options for a round
     * @param {string} lobby_id
     * @param {number} round_number
     * @returns {Promise<{data: Option[], error: string|null}>}
     */
    getRoundOptions: async (lobby_id, round_number) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/round/${round_number}/options`);
    },

    /**
     * Submit vote for an option
     * @param {string} lobby_id
     * @param {string} user_id
     * @param {string} option_id
     * @param {number} round_number
     * @param {string} vote 'like', 'dislike', 'superlike'
     * @returns {Promise<{data: any, error: string|null}>}
     */
    vote: async (lobby_id, user_id, option_id, round_number, vote) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/vote`, {
            method: 'POST',
            body: JSON.stringify({ user_id, option_id, round_number, vote }),
        });
    },

    /**
     * Get status of current round
     * @param {string} lobby_id
     * @param {number} round_number
     * @returns {Promise<{data: any, error: string|null}>}
     */
    getRoundStatus: async (lobby_id, round_number) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/round/${round_number}/status`);
    },

    /**
     * Complete round (mark consensus reached)
     * @param {string} lobby_id
     * @param {number} round_number
     * @param {string} selected_option_id
     * @param {string} user_id
     * @returns {Promise<{data: any, error: string|null}>}
     */
    completeRound: async (lobby_id, round_number, selected_option_id, user_id) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/round/${round_number}/complete`, {
            method: 'POST',
            body: JSON.stringify({ selected_option_id, user_id }),
        });
    },
    
    /**
     * Get waiting status (who finished voting)
     * @param {string} lobby_id
     * @returns {Promise<{data: any, error: string|null}>}
     */
    getWaitingStatus: async (lobby_id) => {
        return apiRequest(`/api/consensus/lobby/${lobby_id}/waiting`);
    }
};

export const resultAPI = {
    /**
     * Get final itinerary
     * @param {string} lobby_id
     * @returns {Promise<{data: any, error: string|null}>}
     */
    getItinerary: async (lobby_id) => {
        return apiRequest(`/api/results/lobby/${lobby_id}/itinerary`);
    }
};
