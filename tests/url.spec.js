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
    phoneA ='not-valid-base64!!!';
    result = atobValid(phoneA);
    expect(result).not.toBe(phone);
    expect(result).toBe(null);

})

test('data is valid', async ({ page }) => {
    const price = 45;
    const phone = 88888888;
    const name = 'test'
    const detail = 'detail'

    const result = validateEntryData({ price, phone, name, detail })

    expect(result).not.toBe(null);
});


test('data phone is invalid', async ({ page }) => {
    const price = 45;
    let phone = 8;
    const name = 'test'
    const detail = 'detail'

    let result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = '8888-8888'
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);

    // @ts-ignore
    phone = '8888&888'
    result = validateEntryData({ price, phone, name, detail })
    expect(result).toBe(null);
});

