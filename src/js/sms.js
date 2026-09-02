import { strLen } from 'i18n';

export const SMS_START = 'PASE ';

/**
 * Generates the SINPE message
 * to be used with window.location.assign or window.location.href
 * PASE price phone name detail
 * @param {Number} bankPhone 
 * @param {Number} price 
 * @param {Number} phone 
 * @param {String} name 
 * @param {String} detail 
 */

export default function generateSINPESMS(bankPhone, price, phone, name, detail) {
    // encode to avoid possible exploit
    bankPhone = encodeURIComponent(bankPhone);
    price = encodeURIComponent(price);
    phone = encodeURIComponent(phone);
    name = encodeURIComponent(name);
    detail = encodeURIComponent(detail);
    return `sms:${bankPhone}?body=${SMS_START}${price} ${phone} ${name} ${detail}`;
}

// tests only
if (import.meta.env.DEV) {
    window.generateSINPESMS = generateSINPESMS;
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

export function validateSMS(smsStartText, price, phone, name, detail) {
    const values = [price, phone, name, detail];
    const { smsText, numChars } = cleanTextAndLength(smsStartText, values);
    const hasUnicode = isUnicode(smsText);
    const maxLength = hasUnicode ? 70 : 160;
    return numChars <= maxLength;
}
