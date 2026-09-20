import { DURATION_SECONDS } from 'timer';
import { deriveKey, decrypt } from 'crypto';

/**
 * Tries to decrypt the encrypted data from a url (qrcode) using the current
 * date. If tries fail, there's no result.
 * This means the user needs to read the QR code near the time it was created
 * or they won't be able to get the data. Also means that reading an old code
 * wont work.
 * @param {*} salt
 * @param {*} iv
 * @param {*} ciphertext
 * @param {*} pin
 * @returns decrypted data or null
 */
export async function getDecryptedData(salt, iv, ciphertext, pin) {
    const TIME_WINDOW = DURATION_SECONDS;
    const epochSeconds = Math.floor(Date.now() / 1000);
    const currentBlock = Math.floor(epochSeconds / TIME_WINDOW);

    const candidateBlocks = [currentBlock - 1, currentBlock, currentBlock + 1];

    let decryptedData = null;

    for (const block of candidateBlocks) {
        try {
            const passphrase = `${pin}_${block}`;
            const decryptionKey = await deriveKey(passphrase, salt);
            decryptedData = await decrypt(ciphertext, iv, decryptionKey);
            if (decryptedData) break;
        } catch (e) {
            // try nex block
        }
    }

    return decryptedData;
}
