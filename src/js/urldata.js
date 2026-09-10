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
    const finalPhone = +decodedPhone;
    const phoneIsNumber = !Number.isNaN(finalPhone);
    const phoneLengthIsCorrect = String(decodedPhone).length === 8;

    if (!phoneIsNumber || !phoneLengthIsCorrect) {
        valid = false;
    }

    const priceLengthIsCorrect = String(price).length < 6;
    const finalPrice = +price;
    const priceIsNumber = !Number.isNaN(finalPrice);
    const finalPriceIsPositve = finalPrice > 0;

    if (!priceIsNumber || !finalPriceIsPositve || !priceLengthIsCorrect) {
        valid = false;
    }

    const nameHasData = name.length > 0;
    if (!nameHasData) {
        valid = false;
    }

    if (!valid) {
        return null;
    }

    return {
        price: finalPrice,
        phone: finalPhone,
        name,
        detail,
    }
}
