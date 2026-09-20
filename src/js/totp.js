import { DURATION_SECONDS } from 'timer';
import { deriveKey, decrypt } from 'crypto';

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
