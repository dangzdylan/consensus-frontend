/**
 * Storage utilities using AsyncStorage
 * Handles persisting user data and session
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    USER: '@consensus:user',
    USER_ID: '@consensus:user_id',
    USERNAME: '@consensus:username',
};

/**
 * Save user data to storage
 * @param {object} userData - User object from backend
 */
export const saveUser = async (userData) => {
    try {
        // Validate userData before saving
        if (!userData || typeof userData !== 'object') {
            throw new Error('Invalid user data: must be an object');
        }
        
        // Stringify and validate JSON
        const userJson = JSON.stringify(userData);
        if (!userJson || userJson === '{}') {
            throw new Error('Invalid user data: cannot be empty');
        }
        
        await AsyncStorage.setItem(STORAGE_KEYS.USER, userJson);
        
        if (userData.user_id) {
            await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, String(userData.user_id));
        }
        if (userData.username) {
            await AsyncStorage.setItem(STORAGE_KEYS.USERNAME, String(userData.username));
        }
        console.log('[Storage] User saved:', userData.username || 'unknown');
    } catch (error) {
        console.error('[Storage] Error saving user:', error);
        throw error;
    }
};

/**
 * Get user data from storage
 * @returns {Promise<object|null>} User object or null
 */
export const getUser = async () => {
    try {
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        
        // Check if userJson exists and is not empty
        if (!userJson || userJson.trim() === '') {
            console.log('[Storage] No user data found in storage');
            return null;
        }
        
        // Validate JSON before parsing
        try {
            const user = JSON.parse(userJson);
            
            // Validate user object has required fields
            if (!user || typeof user !== 'object') {
                console.warn('[Storage] Invalid user data format, clearing...');
                await clearUser();
                return null;
            }
            
            console.log('[Storage] User retrieved:', user.username || 'unknown');
            return user;
        } catch (parseError) {
            console.error('[Storage] JSON parse error:', parseError);
            console.error('[Storage] Invalid JSON data:', userJson);
            // Clear corrupted data
            await clearUser();
            return null;
        }
    } catch (error) {
        console.error('[Storage] Error getting user:', error);
        return null;
    }
};

/**
 * Get user ID from storage
 * @returns {Promise<string|null>} User ID or null
 */
export const getUserId = async () => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
        console.error('[Storage] Error getting user ID:', error);
        return null;
    }
};

/**
 * Get username from storage
 * @returns {Promise<string|null>} Username or null
 */
export const getUsername = async () => {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
    } catch (error) {
        console.error('[Storage] Error getting username:', error);
        return null;
    }
};

/**
 * Clear user data from storage (logout)
 */
export const clearUser = async () => {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.USER,
            STORAGE_KEYS.USER_ID,
            STORAGE_KEYS.USERNAME,
        ]);
        console.log('[Storage] User cleared');
    } catch (error) {
        console.error('[Storage] Error clearing user:', error);
        throw error;
    }
};

/**
 * Check if user is logged in
 * @returns {Promise<boolean>}
 */
export const isLoggedIn = async () => {
    const user = await getUser();
    return user !== null;
};

/**
 * Clear all storage (useful for debugging or reset)
 */
export const clearAllStorage = async () => {
    try {
        await AsyncStorage.clear();
        console.log('[Storage] All storage cleared');
    } catch (error) {
        console.error('[Storage] Error clearing all storage:', error);
        throw error;
    }
};

