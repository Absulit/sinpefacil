// @ts-check
import { test, expect } from '@playwright/test';
import { validateEntryData, atobValid } from 'urldata';


test('atobValid', async ({ page }) => {
    let phone = '88888888';
    let phoneA = btoa(phone);
    let result = atobValid(phoneA);

    expect(result).toBe(phone);
    expect(result).not.toBe(null);

    // phone = 'not-valid-base64!!!';
    phoneA = 'not-valid-base64!!!';
    result = atobValid(phoneA);
    expect(result).not.toBe(phone);
    expect(result).toBe(null);

})

test('data is valid', async ({ page }) => {
    const phone = '88888888';
    const price = 45;
    const phoneA = btoa(phone);
    const name = 'test'
    const detail = 'detail'

    const result = validateEntryData({ price, phone: phoneA, name, detail })

    expect(result).toEqual({ price, phone: +phone, name, detail });
});

test('data phone is invalid', async ({ page }) => {
    const price = 45;
    let phone = btoa('8'); // should be 8 chars
    const name = 'test'
    const detail = 'detail'

    let result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = btoa('8888-8888') // is 9 chars
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = btoa('8888888') // is 7 chars
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = btoa('888888A') // should be a number
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = btoa('12345678') // is a valid number
    result = validateEntryData({ price, phone, name, detail })
    expect(result?.phone).toBe(12345678);

    // @ts-ignore
    phone = '888888A' // should be a number
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = '0888888' // this is 7 chars because the 0 is ignored
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);
});

test('data can have an empty detail', async ({ page }) => {
    const phone = '88888888';
    const price = 45;
    const phoneA = btoa(phone);
    const name = 'test'
    const detail = ''

    const result = validateEntryData({ price, phone:phoneA, name, detail })

    expect(result).not.toBe(null);
});

test('data must fail if it has no name', async ({ page }) => {
    const phone = '88888888';
    const price = 45;
    const phoneA = btoa(phone);
    const name = ''
    const detail = ''

    const result = validateEntryData({ price, phone:phoneA, name, detail })

    expect(result).toBe(null);
});

test('price is valid', async ({ page }) => {
    const phone = '88888888';
    let price = 45;
    const phoneA = btoa(phone);
    const name = 'test'
    const detail = 'detail'

    let result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual({ price, phone: +phone, name, detail });

    price = -45;// no negatives
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    price = 0;// no zero
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    // @ts-ignore
    price = '45a'; // is number
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    // @ts-ignore
    price = '08888888'; // is number
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);
});

// name price phone
test('name cant be null or undefined or non strings', async ({ page }) => {
    const phone = '12345678';
    const price = 45;
    const phoneA = btoa(phone);
    let name = null;
    const detail = ''

    let result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    name = undefined
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    name = '        '
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);

    name = ''
    result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);
});

test('no empty spaces on name', async ({ page }) => {
    const phone = '12345678';
    const price = 45;
    const phoneA = btoa(phone);
    const name = ''
    const detail = ''

    const result = validateEntryData({ price, phone: phoneA, name, detail })
    expect(result).toEqual(null);
});

