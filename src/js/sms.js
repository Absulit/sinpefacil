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
