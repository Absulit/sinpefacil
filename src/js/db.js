import { Dexie } from 'dexie';

export const db = new Dexie('sf');

// Define database schema
db.version(2).stores({
    products: '++id, phone, name, price',
    options: 'key, value',
    banks: '++id, name, shortname, &phone',
    phones: '++id, name, &number',
});

const bankCount = await db.banks.count();
if (bankCount === 0) {
    db.banks.bulkAdd([
        { name: 'BAC Credomatic', shortname: 'BAC', phone: 70701222 },
        { name: 'Banco Nacional de Costa Rica', shortname: 'BNCR', phone: 2627 },
        { name: 'Banco de Costa Rica', shortname: 'BCR', phone: 2272 },
        { name: 'Banco Davivienda', shortname: 'Davivienda', phone: 70707474 },
        { name: 'Banco BCT', shortname: 'BCT', phone: 60400300 },
    ])
}

/**
 * Constant keys for values available to store.
 * Do not use single strings.
 */
export const Keys = {
    PAGE_TO_LOAD: 'PAGE_TO_LOAD',
    LANG: 'LANG',
    SELECTED_BANK: 'selectedBank',
}

Object.freeze(Keys);

export async function saveOption(key, value) {
    await db.options.put({ key, value });
}

export async function getOption(key, defaultValue) {
    const option = await db.options.get(key);
    return option ? option.value : defaultValue;
}
