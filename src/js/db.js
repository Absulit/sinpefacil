import { Dexie } from 'dexie';
import { encryptData, decryptData } from 'crypto';

export const db = new Dexie('sf');

// tests only
if (import.meta.env.DEV) {

    window.db = db;

    // import { exportDB, importDB } from 'dexie-export-import';
    // import download from 'downloadjs';
    const { exportDB, importDB } = await import('dexie-export-import');
    const download = (await import('downloadjs')).default;

    // export
    // const blob = await db.export();
    // download(blob, `sf-export.json`, "application/json");

    // import
    // await Dexie.delete('sf');
    // const response = await fetch('/sf-export.json');
    // const blob = await response.blob();

    // await importDB(blob, { overwriteValues: true });
    // console.log('Current DB Version:', db.verno);
}

// Define database schema
db.version(2).stores({
    products: '++id, phone, name, price',
    options: 'key, value',
    banks: '++id, name, shortname, &phone',
    phones: '++id, name, &number',
    history: '++id, price, phone, name, detail, createdAt'
}).upgrade(async tx => {
    const banks = tx.table('banks');
    const bankCount = await banks.count();
    if (bankCount === 0) {
        await banks.bulkAdd([
            { name: 'BAC Credomatic', shortname: 'BAC', phone: 70701222 },
            { name: 'Banco Nacional de Costa Rica', shortname: 'BNCR', phone: 2627 },
            { name: 'Banco de Costa Rica', shortname: 'BCR', phone: 2272 },
            { name: 'Banco Davivienda', shortname: 'Davivienda', phone: 70707474 },
            { name: 'Banco BCT', shortname: 'BCT', phone: 60400300 },
        ])
    }
});

db.version(3).upgrade(async tx => {
    const products = tx.table('products');
    let productsList = await products.toArray();
    productsList = await Promise.all(
        productsList.map(async product => {
            product.phone = await encryptData(product.phone);
            await products.put(product)
        })
    )
});


/**
 * Constant keys for values available to store.
 * Do not use single strings.
 */
export const Keys = {
    PAGE_TO_LOAD: 'PAGE_TO_LOAD',
    LANG: 'LANG',
    SELECTED_BANK: 'selectedBank',
    FIRST_TIME: 'FIRST_TIME',
    HMAC_SECRET: 'HMAC_SECRET',
}

Object.freeze(Keys);

export async function saveOption(key, value) {
    await db.options.put({ key, value });
}

export async function getOption(key, defaultValue) {
    const option = await db.options.get(key);
    return option ? option.value : defaultValue;
}

/**
 * We save currently only one
 * @param {{stage}} param0 
 * @param {Number} number phone number
 */
export async function savePhone(number) {
    const phone = (await db.phones.limit(1).toArray())[0];

    number = await encryptData(number);

    if (phone) {
        await db.phones.update(phone.id, { number })
    } else {
        await db.phones.add({ number });
    }
}

export async function getPhone() {
    const phone = (await db.phones.limit(1).toArray())[0];
    if (!phone) {
        return null;
    }
    const { ciphertext, iv } = phone.number;
    if (!ciphertext) {
        return {}
    }
    phone.number = await decryptData(ciphertext, iv);
    return phone;
}

