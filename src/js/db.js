import { Dexie } from 'dexie';

export const db = new Dexie('sf');

// Define database schema
db.version(1).stores({
    products: '++id, phone, name, price',
    options: 'key, value'
});

/**
 * Constant keys for values available to store.
 * Do not use single strings.
 */
export const Keys = {
    PAGE_TO_LOAD: 'PAGE_TO_LOAD',
    LANG: 'LANG',
}

Object.freeze(Keys);

export async function saveOption(key, value) {
    await db.options.put({ key, value });
}

export async function getOption(key, defaultValue) {
    const option = await db.options.get(key);
    return option ? option.value : defaultValue;
}
