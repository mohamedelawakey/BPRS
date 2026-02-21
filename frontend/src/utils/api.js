/**
 * Central API client for the BPRS backend.
 * All requests go through /api which is proxied to http://localhost:8000 by Vite.
 */

const BASE_URL = '/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'bprs_access_token';
const REFRESH_TOKEN_KEY = 'bprs_refresh_token';

// ─── Token helpers ──────────────────────────────────────────────────────────

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const hasTokens = () => !!getAccessToken();

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

/**
 * Makes an authenticated API request.
 * On 401, it automatically tries to refresh the access token once and retries.
 * If the refresh also fails, it clears tokens and throws.
 *
 * @param {string} path        - API path e.g. '/auth/login'
 * @param {RequestInit} options - fetch options
 * @param {boolean} _isRetry   - internal flag to prevent infinite refresh loop
 */
export async function apiFetch(path, options = {}, _isRetry = false) {
    const accessToken = getAccessToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    // Auto-refresh on 401 (Unauthorized) — but only once
    if (response.status === 401 && !_isRetry) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            // Retry the original request with new token
            return apiFetch(path, options, true);
        }
        // Refresh also failed — clear session
        clearTokens();
        throw new Error('Session expired. Please log in again.');
    }

    return response;
}

/**
 * Attempts to refresh the access token using the stored refresh token.
 * Returns true on success, false on failure.
 */
async function tryRefreshToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        saveTokens(data.access_token, data.refresh_token);
        return true;
    } catch {
        return false;
    }
}

// ─── Auth API ────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Backend expects OAuth2 form data (application/x-www-form-urlencoded).
 * Returns { access_token, refresh_token, token_type }
 */
export async function loginApi(email, password) {
    const formBody = new URLSearchParams({
        username: email,  // OAuth2PasswordRequestForm uses 'username'
        password,
    });

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Login failed');
    }

    return response.json(); // { access_token, refresh_token, token_type }
}

/**
 * POST /users/register
 * Returns UserResponse { id, email, full_name, role, is_active, created_at }
 */
export async function registerApi({ email, full_name, password }) {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name, password }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Registration failed');
    }

    return response.json(); // UserResponse
}

/**
 * GET /users/me
 * Returns UserResponse for the currently authenticated user.
 */
export async function getMeApi() {
    const response = await apiFetch('/users/me');

    if (!response.ok) {
        throw new Error('Could not fetch user profile');
    }

    return response.json(); // UserResponse
}

/**
 * POST /auth/logout
 * Blacklists the current access token on the backend.
 */
export async function logoutApi() {
    try {
        await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
        // Silently ignore logout errors — tokens will be cleared client-side anyway
    }
}

// ─── Search API ──────────────────────────────────────────────────────────────

/**
 * POST /search/
 * @param {object} params
 * @param {string} params.query      - Search query text
 * @param {number} [params.top_k]    - Number of results (default: backend default)
 * @param {boolean} [params.apply_rerank] - Whether to rerank results (default: true)
 * @returns {Promise<{ success, query, total_results, results[] }>}
 */
export async function searchApi({ query, top_k, apply_rerank }) {
    const body = { query };
    if (top_k !== undefined) body.top_k = top_k;
    if (apply_rerank !== undefined) body.apply_rerank = apply_rerank;

    const response = await apiFetch('/search/', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Search failed');
    }

    return response.json(); // { success, query, total_results, results }
}

// ─── User Interests API ───────────────────────────────────────────────────────

/**
 * PATCH /users/me/interests
 * Saves the user's interests to the backend database.
 * @param {string[]} interests - Array of interest strings
 * @returns {Promise<UserResponse>}
 */
export async function updateInterestsApi(interests) {
    const response = await apiFetch('/users/me/interests', {
        method: 'PATCH',
        body: JSON.stringify({ interests }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to save interests');
    }

    return response.json(); // updated UserResponse
}
