import { createContext, useContext, useState, useEffect } from 'react';
import {
    getSession,
    saveSession,
    clearSession,
    getUserById,
    authenticateUser,
    createUser,
    updateUser,
    getGuestSearchCount,
    incrementGuestSearchCount,
    resetGuestSearchCount
} from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [guestSearchCount, setGuestSearchCount] = useState(0);

    // Check for existing session on mount
    useEffect(() => {
        const loadSession = async () => {
            const session = getSession();
            if (session && session.isAuthenticated) {
                const user = await getUserById(session.userId);
                if (user) {
                    setCurrentUser(user);
                    setIsAuthenticated(true);
                } else {
                    clearSession();
                }
            }

            // Load guest search count
            setGuestSearchCount(getGuestSearchCount());
            setIsLoading(false);
        };

        loadSession();
    }, []);

    const login = async (email, password) => {
        const result = await authenticateUser(email, password);

        if (result.success) {
            setCurrentUser(result.user);
            setIsAuthenticated(true);
            saveSession(result.user);
            resetGuestSearchCount();
            setGuestSearchCount(0);
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const signup = async (userData) => {
        const result = await createUser(userData);

        if (result.success) {
            setCurrentUser(result.user);
            setIsAuthenticated(true);
            saveSession(result.user);
            resetGuestSearchCount();
            setGuestSearchCount(0);
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        clearSession();
    };

    const updateCurrentUser = async (updates) => {
        if (!currentUser) return { success: false, error: 'No user logged in' };

        const result = updateUser(currentUser.id, updates);

        if (result.success) {
            setCurrentUser(result.user);
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const trackGuestSearch = () => {
        if (!isAuthenticated) {
            const newCount = incrementGuestSearchCount();
            setGuestSearchCount(newCount);
            return newCount;
        }
        return 0;
    };

    const value = {
        currentUser,
        isAuthenticated,
        isLoading,
        guestSearchCount,
        login,
        signup,
        logout,
        updateCurrentUser,
        trackGuestSearch
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
