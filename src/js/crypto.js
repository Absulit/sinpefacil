/**
 * CryptoService - Native Web Crypto API wrapper for offline-first SPAs
 */
export default class CryptoService {
    /**
     * Derive a 256-bit AES-GCM Key from a user passphrase/PIN using PBKDF2
     */
    static async deriveKey(passphrase, saltHex) {
        const encoder = new TextEncoder();
        const salt = this.hexToBuf(saltHex);

        const baseKey = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 250000, // High iteration count to resist brute-force
                hash: 'SHA-256',
            },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Generate an HMAC-SHA256 Blind Index (Deterministic Hash) for searchable fields
     */
    static async generateBlindIndex(plainText, secretKeyString) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKeyString);
        const messageData = encoder.encode(plainText.trim().toLowerCase());

        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
        return this.bufToHex(signature);
    }

    /**
     * Encrypt plain text using AES-GCM with a unique 12-byte IV per operation
     */
    static async encrypt(plainText, cryptoKey) {
        const encoder = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Fresh IV for every record

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            encoder.encode(plainText)
        );

        return {
            ciphertext: this.bufToHex(encryptedBuffer),
            iv: this.bufToHex(iv),
        };
    }

    /**
     * Decrypt AES-GCM encrypted payload
     */
    static async decrypt(ciphertextHex, ivHex, cryptoKey) {
        const ciphertext = this.hexToBuf(ciphertextHex);
        const iv = this.hexToBuf(ivHex);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            ciphertext
        );

        return new TextDecoder().decode(decryptedBuffer);
    }

    // --- Helper Buffers & Hex Converters ---
    static bufToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
    }

    static hexToBuf(hexString) {
        return new Uint8Array(
            hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        );
    }

    static generateSalt() {
        return this.bufToHex(window.crypto.getRandomValues(new Uint8Array(16)));
    }
}


import { getOption, saveOption, Keys } from 'db';

/**
 * Secret for hashing
 * @returns random 256-bit (32-byte) hex string
 */
export async function getSecret() {
    let secret = await getOption(Keys.HMAC_SECRET, null);
    if (!secret) {
        const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
        secret = Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        saveOption(Keys.HMAC_SECRET, secret);
    }
    return secret;
}


async function getCryptoKey() {
    const secretString = await getSecret();
    const encoder = new TextEncoder();

    return await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(secretString.padEnd(32, '0').slice(0, 32)), // Ensure 256-bit (32 byte) key length
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

export async function encryptData(plainText) {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();

    // Always generate a unique 12-byte IV for every encryption operation
    // Initialization Vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv }, //
        key,
        encoder.encode(plainText)
    );

    // Return both ciphertext and IV as hex strings to save in Dexie
    return {
        ciphertext: Array.from(new Uint8Array(cipherBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
    };
}

export async function decryptData(ciphertextHex, ivHex) {
    const key = await getCryptoKey();

    // Convert hex strings back to Uint8Arrays
    const ciphertext = new Uint8Array(ciphertextHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv }, //
        key,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}
