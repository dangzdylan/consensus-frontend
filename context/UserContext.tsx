import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getUser, saveUser, clearUser } from '../utils/storage';

interface UserData {
    user_id: string;
    username: string;
    [key: string]: any;
}

interface UserContextType {
    user: UserData | null;
    loading: boolean;
    login: (userData: UserData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<{ success: boolean; error?: string }>;
    isAuthenticated: boolean;
    userId: string | null;
    username: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    // Auto-login disabled per user request: start not loading, default to null user
    const [loading, setLoading] = useState(false);

    // Auto-login disabled per user request
    useEffect(() => {
        console.log('[UserContext] Auto-login disabled. Starting locally with no user.');
    }, []);

    const login = async (userData: UserData) => {
        try {
            await saveUser(userData);
            setUser(userData);
            console.log('[UserContext] User logged in:', userData.username);
            return { success: true };
        } catch (error: any) {
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
        } catch (error: any) {
            console.error('[UserContext] Error logging out:', error);
            return { success: false, error: error.message };
        }
    };

    const value: UserContextType = {
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
