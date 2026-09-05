import { Dexie } from 'dexie';
import { encryptData, decryptData } from 'crypto';

export const db = new Dexie('sf');

// tests only
if (import.meta.env.DEV) {

    window.db = db;


    // import
    // const { importDB } = await import('dexie-export-import');
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
            if (!product.phone) return
            product.phone = await encryptData(product.phone.toString());
            await products.put(product)
        })
    )

    const history = tx.table('history');
    let historyList = await history.toArray();
    historyList = await Promise.all(
        historyList.map(async historyItem => {
            historyItem.phone = await encryptData(historyItem.phone.toString());
            await history.put(historyItem);
        })
    )

    const phones = tx.table('phones');
    let phonesList = await phones.toArray();
    phonesList = await Promise.all(
        phonesList.map(async phone => {
            phone.number = await encryptData(phone.number.toString());
            await phones.put(phone);
        })
    )

    const banks = tx.table('banks');
    await banks.bulkUpdate([
        { key: 3, changes: { phone: 4066 } }, // BCR
    ]);

    await banks.bulkAdd([
        { name: 'Grupo Mutual Alajuela', shortname: 'Mutual Alajuela', phone: 60575079 },
        { name: 'Coopecaja', shortname: 'Coopecaja', phone: 62229526 },
        { name: 'Banco Lafise', shortname: 'Lafise', phone: 9091 },
        { name: 'Caja de Ande', shortname: 'Caja de Ande', phone: 62229532 },
        { name: 'Coopealianza', shortname: 'Coopealianza', phone: 62229523 },
        { name: 'Coocique', shortname: 'Coocique', phone: 46002905 },
        { name: 'Banco Promérica', shortname: 'Promérica', phone: 62232450 },
        { name: 'Credecoop', shortname: 'Credecoop', phone: 71984256 },
    ])

});

const activeVersion = db.verno;

window.gtag?.('event', 'db_version_check', {
    db_version: activeVersion,
    is_outdated: activeVersion < 3
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

// tests only
if (import.meta.env.DEV) {
    // // export
    // const { exportDB } = await import('dexie-export-import');
    // const download = (await import('downloadjs')).default;

    // const blob = await db.export();
    // download(blob, `sf-export.json`, "application/json");
}

