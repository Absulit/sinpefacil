import { Dexie } from 'dexie';

export const db = new Dexie('sf');

// Define database schema
db.version(1).stores({
    options: 'key, value'
});

export async function saveOption(key, value) {
    await db.options.put({ key, value });
}

export async function getOption(key) {
    const option = await db.options.get(key);
    return option ? option.value : null;
}
