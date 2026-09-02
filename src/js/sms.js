import { strLen } from 'i18n';

/**
 * Redirects to the SMS app to generate the SINPE message
 * PASE price phone name detail
 * @param {Number} bankPhone 
 * @param {Number} price 
 * @param {Number} phone 
 * @param {String} name 
 * @param {String} detail 
 */
export default function generateSINPESMS(bankPhone, price, phone, name, detail) {
    window.location.href = `sms:${bankPhone}?body=PASE ${price} ${phone} ${name} ${detail}`;
}

/**
 * non unicode chars available in a sms to test against
 */
const nonUnicodeRegex = /[^A-Za-z0-9@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà\f^{}\\[~\]|€]/;

export function isUnicode(text) {
    return nonUnicodeRegex.test(text);
}

/**
 * 
 * @param {String} smsStartText 
 * @param {Array} values 
 * @returns 
 */
export function cleanTextAndLength(smsStartText, values) {
    let smsText = smsStartText;
    values.forEach(v => smsText += v + ' ');
    smsText = smsText.trim().replace(/\s+/g, ' ');
    const numChars = strLen(smsText);
    return { smsText, numChars }
}

export const SMS_START = 'PASE ';

export function validateSMS(smsStartText, price, phone, name, detail) {
    const values = [price, phone, name, detail];
    const { smsText, numChars } = cleanTextAndLength(smsStartText, values);
    const hasUnicode = isUnicode(smsText);
    const maxLength = hasUnicode ? 70 : 160;
    return numChars <= maxLength;
}
