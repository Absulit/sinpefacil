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
