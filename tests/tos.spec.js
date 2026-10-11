import { test, expect } from '@playwright/test';


test.describe('TOS flow', _ => {

    test('TOS dialog shows if it hasnt been acepted', async ({ page }) => {

        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        const dialogTitle = await page.locator('.dialog-title').innerText();

        expect(dialogTitle).toBe('Terms and Conditions');
    })

    test('Click on TOS dialog link loads the full TOS', async ({ page }) => {

        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        await page.locator('.tos').click();

        await expect(page.locator('.page-content .tos')).toBeVisible();
    })

})

