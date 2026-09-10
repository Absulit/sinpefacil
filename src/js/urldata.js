/**
 * Clears parameters from the url to avoid trigger a new sms
 */
export function clearParams() {
    if (window.location.search) {
        window.history.replaceState(
            {}, // State object (can store data, optional)
            document.title, // Page title (optional, ignored by most browsers)
            window.location.pathname // New URL (path only, no parameters)
        );
    }
}

export function atobValid(str, defaultValue = null) {
    // !str.trim() empty or/with white spaces
    if (typeof str !== 'string' || !str.trim()) {
        return defaultValue;
    }
    try {
        return atob(str.trim());
    } catch (e) {
        return defaultValue;
    }
}


export function validateEntryData({ price, phone, name, detail }) {
    let valid = true;
    const decodedPhone = atobValid(phone);
    const phoneStr = typeof decodedPhone === 'string' ? decodedPhone.trim() : '';
    const finalPhone = +phoneStr;

    const phoneIsNumber = phoneStr.length > 0 && !Number.isNaN(finalPhone) && Number.isInteger(finalPhone);
    const phoneLengthIsCorrect = phoneStr.length === 8;

    if (!phoneIsNumber || !phoneLengthIsCorrect) {
        valid = false;
    }

    const priceStr = String(price ?? '').trim();
    const finalPrice = +priceStr;
    const priceIsNumber = priceStr.length > 0 && !Number.isNaN(finalPrice);
    const finalPriceIsPositive = finalPrice > 0;
    const priceLengthIsCorrect = priceStr.length <= 6;

    if (!priceIsNumber || !finalPriceIsPositive || !priceLengthIsCorrect) {
        valid = false;
    }

    const nameHasData = typeof name === 'string' && name.trim().length > 0;
    if (!nameHasData) {
        valid = false;
    }

    if (!valid) {
        return false;
    }

    return {
        price: finalPrice,
        phone: finalPhone,
        name: name.trim(),
        detail,
    };
}

/**
 *
 * @param {Object} value
 */
export function isEmtpy(value){
    Object.keys(value).length === 0;
}