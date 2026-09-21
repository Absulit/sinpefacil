/**
 * Derive a 256-bit AES-GCM Key from a user passphrase/PIN using PBKDF2
 */
export async function deriveKey(passphrase, saltHex) {
    const encoder = new TextEncoder();
    const salt = hexToBuf(saltHex);

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
async function generateBlindIndex(plainText, secretKeyString) {
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
export async function encrypt(plainText, cryptoKey) {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Fresh IV for every record

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encoder.encode(plainText)
    );

    return {
        ciphertext: bufToHex(encryptedBuffer),
        iv: bufToHex(iv),
    };
}

/**
 * Decrypt AES-GCM encrypted payload
 */
export async function decrypt(ciphertextHex, ivHex, cryptoKey) {
    const ciphertext = hexToBuf(ciphertextHex);
    const iv = hexToBuf(ivHex);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}

// --- Helper Buffers & Hex Converters ---
function bufToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBuf(hexString) {
    return new Uint8Array(
        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
}

export function generateSalt() {
    return bufToHex(window.crypto.getRandomValues(new Uint8Array(16)));
}

// ---------------------------------------------------------

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
    return await encrypt(plainText, key);
}

export async function decryptData(ciphertextHex, ivHex) {
    const key = await getCryptoKey();
    return await decrypt(ciphertextHex, ivHex, key)
}
