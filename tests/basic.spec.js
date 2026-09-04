// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:5173/sinpefacil/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/SINPE Fácil/);
});

test('shows about the first time', async ({ page }) => {
    await page.goto('http://localhost:5173/sinpefacil/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('div[data-name="about"]')).toBeVisible();
    await page.reload();
    // next time should not be visible
    await expect(page.locator('div[data-name="about"]')).not.toBeVisible();
});

test.describe('Clipboard Operations', () => {
    test.beforeEach(async ({ context, browserName }) => {
        if (browserName !== 'firefox') {
            await context.grantPermissions(['clipboard-read']);
        }
    });
    test('creating a product allows to share link', async ({ page }) => {
        // page.on('console', (msg) => console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`));
        // page.on('pageerror', (exception) => console.error(`[BROWSER UNCAUGHT EXCEPTION]`, exception));

        await page.goto('http://localhost:5173/sinpefacil/', { waitUntil: 'domcontentloaded' });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        const phone = '47474747';
        const name = 'Popcorn 1 🍿';
        const price = '2500';
        const detail = 'Popcorn from Aunt M factory';

        const viewCodesButton = page.locator('#view-codes');
        await viewCodesButton.click();

        const addNewCode = page.locator('.onClickAdd');
        await addNewCode.click();

        await page.locator('#phone').fill(phone);
        await page.locator('#name').fill(name);
        await page.locator('#price').fill(price);
        await page.locator('#detail').fill(detail);

        await page.locator('#submitCodeForm').click();
        await page.waitForTimeout(3000)
        const listItem = page.locator('.list .item-link.item-content').first();

        if (await listItem.isVisible()) {
            await listItem.click();
            const shareButton = page.locator('.right .link.icon-only.popup-open').nth(1)
            await shareButton.click();


            const copyLink = page.locator('.actions-button .actions-button-text').first()
            await copyLink.click();

            const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

            const generatedLink = await page.evaluate(async ({ phone, name, price, detail }) => {
                // @ts-ignore
                const { createURL } = window;
                return createURL(phone, name, price, detail);
            }, { phone, name, price, detail });

            expect(clipboardText).toBe(generatedLink);

        }

    });

});
