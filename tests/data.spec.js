import { test, expect } from '@playwright/test';

test.describe('Security - Dexie Data Integrity & Rendering', () => {

    test('should sanitize persisted Dexie data on re-render', async ({ page }) => {
        // page.on('console', (msg) => console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`));
        // page.on('pageerror', (exception) => console.error(`[BROWSER UNCAUGHT EXCEPTION]`, exception));


        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        const payload = '<img src=x onerror=alert(1)> Safe Name Test';

        // Inject unsafe data directly into Dexie using page.evaluate
        await page.evaluate(async (payload) => {
            const { store } = window;
            store.dispatch('addProduct', {
                name: payload,
                phone: '<b>Test Content</b>',
                price: '<b>Test Content</b>'
            })

        }, payload);

        const codesFirstItem = page.locator('.item-link.item-content').first();
        await codesFirstItem.click()

        // 3. Verify HTML tags are escaped and no unexpected script tags executed
        const noteTitle = page.locator('.card-header');
        await expect(noteTitle).toContainText(payload);

        // Ensure the raw img tag with onerror was NOT parsed as actual HTML
        const injectedImg = page.locator('.card-header img');
        await expect(injectedImg).toHaveCount(0);
    });


    test('Dexie Security: handles corrupted primary key or indexed types gracefully', async ({ page }) => {
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        await page.evaluate(async () => {
            if (window.db && window.db.history) {
                // all wrong data
                await window.db.history.add({
                    id: { nested: 'invalid-id-type' },
                    price: null,
                    phone: 123456789,
                    createdAt: 'INVALID_DATE_STRING'
                }).catch(err => console.log('Handled DB catch:', err));
            }
        });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        // History list
        await page.locator('a[href*="#view-history"]').click();

        const historyPage = page.locator('.page[data-name="history"]');
        await expect(historyPage).toBeVisible();
    });


    test('Dexie Security: Codes: ensure sensitive fields are not stored in plain clear-text', async ({ page }) => {
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        const viewCodesButton = page.locator('#view-codes');
        await viewCodesButton.click();

        const addNewCode = page.locator('.onClickAdd');
        await addNewCode.click();

        // Target input by ID, class, or attribute (e.g., input[name="username"])
        const phoneField = page.locator('#phone');
        const nameField = page.locator('#name');
        const priceField = page.locator('#price');
        const detailField = page.locator('#detail');

        const submitButton = page.locator('#submitCodeForm');

        // Clear field, fill with payload, and submit
        const phoneValue = '88888888';
        await phoneField.fill(phoneValue);
        await nameField.fill('Toreadito');
        await priceField.fill('1000');
        await detailField.fill('');

        await submitButton.click();

        // Retrieve raw records directly from IndexedDB
        const records = await page.evaluate(async () => {
            if (window.db && window.db.products) {
                return await window.db.products.toArray();
            }
            return [];
        });

        for (const record of records) {
            // Assert sensitive fields don't contain plain text raw credentials/secrets
            if (record.phone) {
                expect(record.phone).toEqual(
                    expect.objectContaining({
                        ciphertext: expect.any(String),
                        iv: expect.any(String),
                    })
                );
            }
        }
    });

    test('Dexie Security: History: ensure sensitive fields are not stored in plain clear-text', async ({ page }) => {
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        // History list
        await page.locator('a[href*="#view-history"]').click();

        const phoneValue = '88888888';
        await page.evaluate(async phoneValue => {
            const { store } = window;

            await store.dispatch('addHistoryItem', {
                price: '1000',
                phone: phoneValue,
                name: 'name',
                detail: 'detail',
                createdAt: new Date()
            })

        }, phoneValue);

        // Retrieve raw records directly from IndexedDB
        const records = await page.evaluate(async () => {
            if (window.db && window.db.history) {
                return await window.db.history.toArray();
            }
            return [];
        });

        for (const record of records) {
            // Assert sensitive fields don't contain plain text raw credentials/secrets
            if (record.phone) {
                expect(record.phone).toEqual(
                    expect.objectContaining({
                        ciphertext: expect.any(String),
                        iv: expect.any(String),
                    })
                );
            }
        }
    });

    test('Dexie Security: Settings: ensure sensitive fields are not stored in plain clear-text', async ({ page }) => {
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        const rightMenu = page.locator('.right-menu');
        await rightMenu.waitFor({ state: 'visible' });
        await rightMenu.click();

        const settingsMenu = page.locator('.panel-close.settings');
        await settingsMenu.waitFor({ state: 'visible' });
        await settingsMenu.click();

        // Fill a URL/link field in your form
        const phoneValue = '88888888';
        await page.locator('#phoneInputSettings').fill(phoneValue);

        // Retrieve raw records directly from IndexedDB
        const records = await page.evaluate(async () => {
            if (window.db && window.db.phones) {
                return await window.db.phones.toArray();
            }
            return [];
        });

        for (const record of records) {
            // Assert sensitive fields don't contain plain text raw credentials/secrets
            if (record.number) {
                expect(record.number).toEqual(
                    expect.objectContaining({
                        ciphertext: expect.any(String),
                        iv: expect.any(String),
                    })
                );
            }
        }
    });

});
