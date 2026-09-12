/**
 * General purpose to read file
 * Just to await the function
 * @param {Blob} blob file
 * @returns
 */
export function readAsDataURL(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
