/**
 * User Context
 * Provides user state and authentication methods throughout the app
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser, saveUser, clearUser } from '../utils/storage';

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage on app start
    useEffect(() => {
        let isMounted = true;
        let timeoutId;

        const loadUserData = async () => {
            try {
                console.log('[UserContext] Starting to load user...');
                const storedUser = await getUser();
                if (isMounted) {
                    if (storedUser && storedUser.user_id && storedUser.username) {
                        setUser(storedUser);
                        console.log('[UserContext] User loaded:', storedUser.username);
                    } else {
                        console.log('[UserContext] No valid user found in storage');
                        // Clear any invalid data
                        if (storedUser) {
                            console.log('[UserContext] Clearing invalid user data');
                            await clearUser();
                        }
                    }
                }
            } catch (error) {
                console.error('[UserContext] Error loading user:', error);
                // Clear storage on error to prevent future parse errors
                try {
                    await clearUser();
                } catch (clearError) {
                    console.error('[UserContext] Error clearing storage:', clearError);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log('[UserContext] Loading complete');
                }
            }
        };

        // Set a timeout to prevent infinite loading (5 seconds max)
        timeoutId = setTimeout(() => {
            if (isMounted && loading) {
                console.warn('[UserContext] Loading timeout - forcing completion');
                setLoading(false);
            }
        }, 5000);

        loadUserData();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const login = async (userData) => {
        try {
            await saveUser(userData);
            setUser(userData);
            console.log('[UserContext] User logged in:', userData.username);
            return { success: true };
        } catch (error) {
            console.error('[UserContext] Error logging in:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await clearUser();
            setUser(null);
            console.log('[UserContext] User logged out');
            return { success: true };
        } catch (error) {
            console.error('[UserContext] Error logging out:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: user !== null,
        userId: user?.user_id || null,
        username: user?.username || null,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

