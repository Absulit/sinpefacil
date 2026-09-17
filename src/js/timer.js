const DURATION_SECONDS = 30;
export const DURATION_MILLISECONDS = DURATION_SECONDS * 1000;

let endTime = null;
let intervalId = null;
let onUpdateCB = null;
let onStartCB = null;

export async function timerStart(onStart, onUpdate) {
    endTime = Date.now() + DURATION_MILLISECONDS;

    onUpdateCB = onUpdate;
    onStartCB = onStart;
    await onStartCB();
    intervalId = setInterval(timerUpdate, 1000);
}

async function timerUpdate() {
    const remainingMilliseconds = Math.max(0, endTime - Date.now());
    const secondsLeft = Math.ceil(remainingMilliseconds / 1000);
    onUpdateCB?.(remainingMilliseconds, secondsLeft);
    if (remainingMilliseconds <= 0) {
        endTime = Date.now() + DURATION_MILLISECONDS;
        await onStartCB();
    }
}


export function generatePIN(length = 4) {
    const array = new Uint32Array(1);
    // to get a 4 digit number, it needs a 10_000 limit (max 9999)
    const maxLimit = Math.pow(10, length);

    let otp = '';
    while (otp.length < length) {
        crypto.getRandomValues(array);
        const number = array[0] % maxLimit;
        otp = number.toString().padStart(length, '0'); // e.g. 35 will be 0035
    }

    return otp;
}

export function timerStop() {
    clearInterval(intervalId);
    intervalId = null;
}