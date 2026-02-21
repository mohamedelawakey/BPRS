import { encryptData, decryptData, hashPassword, verifyPassword } from './encryption';

// User storage keys
const USERS_KEY = 'bprs_users';
const SESSION_KEY = 'bprs_session';
const SEARCH_COUNT_KEY = 'bprs_guest_searches';

// Get all users
export const getAllUsers = async () => {
    try {
        const encryptedUsers = localStorage.getItem(USERS_KEY);
        if (!encryptedUsers) return [];

        const users = await decryptData(encryptedUsers);
        return users || [];
    } catch (e) {
        console.error('Error reading users:', e);
        return [];
    }
};

// Save all users
const saveAllUsers = async (users) => {
    try {
        const encrypted = await encryptData(users);
        if (!encrypted) return false;

        localStorage.setItem(USERS_KEY, encrypted);
        return true;
    } catch (e) {
        console.error('Error saving users:', e);
        return false;
    }
};

// Create new user
export const createUser = async (userData) => {
    const users = await getAllUsers();

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
    }

    const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: await hashPassword(userData.password), // Hash password with SHA-256
        avatar: null,
        interests: userData.interests || [],
        favorites: [],
        createdAt: Date.now(),
        lastLogin: Date.now()
    };

    users.push(newUser);

    if (await saveAllUsers(users)) {
        return { success: true, user: { ...newUser, password: undefined } };
    }

    return { success: false, error: 'Failed to save user' };
};

// Authenticate user
export const authenticateUser = async (email, password) => {
    const users = await getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (isValid) {
        // Update last login
        user.lastLogin = Date.now();
        await saveAllUsers(users);

        return {
            success: true,
            user: { ...user, password: undefined }
        };
    }

    return { success: false, error: 'Invalid email or password' };
};

// Get user by ID
export const getUserById = async (userId) => {
    const users = await getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? { ...user, password: undefined } : null;
};

// Update user
export const updateUser = async (userId, updates) => {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return { success: false, error: 'User not found' };
    }

    // If updating password, hash it
    if (updates.password) {
        updates.password = await hashPassword(updates.password);
    }

    users[userIndex] = {
        ...users[userIndex],
        ...updates
    };

    if (await saveAllUsers(users)) {
        return {
            success: true,
            user: { ...users[userIndex], password: undefined }
        };
    }

    return { success: false, error: 'Failed to update user' };
};

// Session management
export const saveSession = (user) => {
    try {
        const session = {
            userId: user.id,
            isAuthenticated: true,
            lastActivity: Date.now()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return true;
    } catch (e) {
        console.error('Error saving session:', e);
        return false;
    }
};

export const getSession = () => {
    try {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    } catch (e) {
        console.error('Error reading session:', e);
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SEARCH_COUNT_KEY);
};

// Guest search tracking
export const getGuestSearchCount = () => {
    try {
        const count = localStorage.getItem(SEARCH_COUNT_KEY);
        return count ? parseInt(count, 10) : 0;
    } catch (e) {
        return 0;
    }
};

export const incrementGuestSearchCount = () => {
    const count = getGuestSearchCount();
    localStorage.setItem(SEARCH_COUNT_KEY, (count + 1).toString());
    return count + 1;
};

export const resetGuestSearchCount = () => {
    localStorage.removeItem(SEARCH_COUNT_KEY);
};

// Add favorite book
export const addFavoriteBook = async (userId, bookId) => {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return { success: false };

    if (!users[userIndex].favorites.includes(bookId)) {
        users[userIndex].favorites.push(bookId);
        await saveAllUsers(users);
    }

    return { success: true };
};

// Remove favorite book
export const removeFavoriteBook = async (userId, bookId) => {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return { success: false };

    users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== bookId);
    await saveAllUsers(users);

    return { success: true };
};

// Get user favorites
export const getUserFavorites = async (userId) => {
    const user = await getUserById(userId);
    return user ? user.favorites : [];
};

// ─── Persistent Interests (keyed by email) ───────────────────────────────────
// Interests are stored separately from the session so they survive logout/login.

const interestsKey = (email) => `bprs_interests_${email}`;

export const saveUserInterests = (email, interests) => {
    try {
        localStorage.setItem(interestsKey(email), JSON.stringify(interests));
    } catch (e) {
        console.error('Error saving interests:', e);
    }
};

export const loadUserInterests = (email) => {
    try {
        const raw = localStorage.getItem(interestsKey(email));
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};
