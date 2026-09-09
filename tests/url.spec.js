// @ts-check
import { test, expect } from '@playwright/test';
import { validateEntryData } from 'urldata';


test('data is valid', async ({ page }) => {
    await page.goto('http://localhost:5173/sinpefacil/');

    const price = 45;
    const phone = 8;
    const name = 'test'
    const detail = 'detail'

    const result = validateEntryData({ price, phone, name, detail })

    // Expect a title "to contain" a substring.
    await expect(result).not.toBe(null);
});

