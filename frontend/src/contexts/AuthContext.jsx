import { createContext, useContext, useState, useEffect } from 'react';
import {
    loginApi,
    registerApi,
    getMeApi,
    logoutApi,
    saveTokens,
    clearTokens,
    hasTokens,
    updateInterestsApi,
} from '../utils/api';
import {
    getGuestSearchCount,
    incrementGuestSearchCount,
    resetGuestSearchCount,
    saveUserInterests,
    loadUserInterests,
} from '../utils/storage';

const AuthContext = createContext(null);

/**
 * Maps the backend UserResponse shape to the frontend user shape.
 * Backend: { id, email, full_name, role, is_active, created_at }
 * Frontend expects: { id, email, name, role, ... }
 */
function mapUser(backendUser) {
    // Prefer interests from the backend (authoritative/DB source).
    // Fall back to localStorage only if backend returns none (e.g. very first login after migration).
    const backendInterests = backendUser.interests || [];
    const interests = backendInterests.length > 0
        ? backendInterests
        : loadUserInterests(backendUser.email);

    return {
        ...backendUser,
        name: backendUser.full_name || backendUser.email,
        avatar: null,
        interests,
        favorites: [],
    };
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [guestSearchCount, setGuestSearchCount] = useState(0);

    // Restore session from stored tokens on mount
    useEffect(() => {
        const restoreSession = async () => {
            if (hasTokens()) {
                try {
                    const backendUser = await getMeApi();
                    setCurrentUser(mapUser(backendUser));
                    setIsAuthenticated(true);
                } catch {
                    // Token invalid or expired and refresh failed — clear everything
                    clearTokens();
                }
            }

            setGuestSearchCount(getGuestSearchCount());
            setIsLoading(false);
        };

        restoreSession();
    }, []);

    /**
     * Login with email + password.
     * Returns { success: true } or { success: false, error: string }
     */
    const login = async (email, password) => {
        try {
            const tokens = await loginApi(email, password);
            saveTokens(tokens.access_token, tokens.refresh_token);

            const backendUser = await getMeApi();
            const user = mapUser(backendUser);

            setCurrentUser(user);
            setIsAuthenticated(true);
            resetGuestSearchCount();
            setGuestSearchCount(0);

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || 'Login failed' };
        }
    };

    /**
     * Register a new user, then auto-login.
     * Returns { success: true } or { success: false, error: string }
     */
    const signup = async (userData) => {
        try {
            // Save interests before registering so they're ready after auto-login
            if (userData.email && userData.interests?.length) {
                saveUserInterests(userData.email, userData.interests);
            }

            await registerApi({
                email: userData.email,
                full_name: userData.name,
                password: userData.password,
            });

            const result = await login(userData.email, userData.password);

            // Save interests to backend after successful login
            if (result.success && userData.interests?.length) {
                try {
                    await updateInterestsApi(userData.interests);
                } catch {
                    // Non-critical — interests already saved to localStorage as fallback
                }
            }

            return result;
        } catch (err) {
            return { success: false, error: err.message || 'Registration failed' };
        }
    };

    /**
     * Logout — blacklists the access token on the backend, then clears local state.
     */
    const logout = async () => {
        await logoutApi();
        clearTokens();
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    /**
     * Update user data in local state only (no backend endpoint available).
     * Changes persist for the current session only.
     */
    const updateCurrentUser = async (updates) => {
        if (!currentUser) return { success: false, error: 'No user logged in' };

        // Persist interests: save to DB (primary) and localStorage (fallback)
        if (updates.interests !== undefined) {
            saveUserInterests(currentUser.email, updates.interests);
            try {
                const updatedFromServer = await updateInterestsApi(updates.interests);
                // Merge server response (includes authoritative interests)
                const merged = {
                    ...currentUser,
                    ...updatedFromServer,
                    name: updatedFromServer.full_name || currentUser.name,
                    avatar: currentUser.avatar,
                    favorites: currentUser.favorites,
                };
                setCurrentUser(merged);
                return { success: true, user: merged };
            } catch {
                // API failed — fall back to local state update only
            }
        }

        const updatedUser = { ...currentUser, ...updates };
        if (updates.full_name) updatedUser.name = updates.full_name;
        setCurrentUser(updatedUser);
        return { success: true, user: updatedUser };
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
        trackGuestSearch,
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
