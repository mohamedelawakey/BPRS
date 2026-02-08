// Encryption utilities using Web Crypto API
// This provides better security than simple hashing

// Generate a key from a password (PBKDF2)
const deriveKey = async (password, salt) => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

// Encrypt data
export const encryptData = async (data, password = 'bprs-default-key-2026') => {
    try {
        const encoder = new TextEncoder();
        const salt = 'bprs-salt-key'; // In production, use random salt per user
        const key = await deriveKey(password, salt);

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedData = encoder.encode(JSON.stringify(data));

        const encryptedData = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encodedData
        );

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedData), iv.length);

        // Convert to base64
        return btoa(String.fromCharCode(...combined));
    } catch (e) {
        console.error('Encryption error:', e);
        return null;
    }
};

// Decrypt data
export const decryptData = async (encryptedString, password = 'bprs-default-key-2026') => {
    try {
        const salt = 'bprs-salt-key';
        const key = await deriveKey(password, salt);

        // Convert from base64
        const combined = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));

        // Extract IV and encrypted data
        const iv = combined.slice(0, 12);
        const encryptedData = combined.slice(12);

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            encryptedData
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decryptedData));
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
};

// Hash password using SHA-256 (better than simple hash)
export const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'bprs-pepper-2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password against hash
export const verifyPassword = async (password, hash) => {
    const newHash = await hashPassword(password);
    return newHash === hash;
};
