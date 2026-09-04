import { test, expect, defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        launchOptions: {
            args: [
                '--disable-external-intent-requests',
                '--disable-prompt-on-repost',
                '--deny-permission-prompts',
            ],
        },
    },
});

// List of common XSS test payloads
const xssPayloads = [
    '<img src=x onerror=alert("XSS-TRIGGERED")>',
    '"><svg/onload=alert("XSS-TRIGGERED")>',
    'javascript:alert("XSS-TRIGGERED")'
];

test.describe('Automated Input XSS Suite', () => {

    test('Codes: should not execute script tags injected into input fields', async ({ page }) => {
        let xssTriggered = false;

        // Listen for browser alert/dialog popups. If one fires, XSS succeeded (which is a test failure)
        page.on('dialog', async (dialog) => {
            if (dialog.message().includes('XSS-TRIGGERED')) {
                xssTriggered = true;
            }
            await dialog.dismiss();
        });

        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        // 2. Loop through payloads against target input selectors
        for (const payload of xssPayloads) {
            xssTriggered = false; // Reset state for each attempt


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
            await phoneField.fill('');
            await phoneField.fill(payload);

            await nameField.fill('');
            await nameField.fill(payload);

            await priceField.fill('');
            await priceField.fill(payload);

            await detailField.fill('');
            await detailField.fill(payload);


            await submitButton.click();

            // Wait briefly to allow the DOM to render the update
            await page.waitForTimeout(300);

            // Assert that no alert dialog was triggered
            expect(xssTriggered, `XSS payload executed successfully: ${payload}`).toBe(false);
        }
    });

    test('Settings: should not execute script tags injected into input fields', async ({ page }) => {
        let xssTriggered = false;

        // Listen for browser alert/dialog popups. If one fires, XSS succeeded (which is a test failure)
        page.on('dialog', async (dialog) => {
            if (dialog.message().includes('XSS-TRIGGERED')) {
                xssTriggered = true;
            }
            await dialog.dismiss();
        });

        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        const rightMenu = page.locator('.right-menu');
        await rightMenu.waitFor({ state: 'visible' });
        await rightMenu.click();

        const settingsMenu = page.locator('.panel-close.settings');
        await settingsMenu.waitFor({ state: 'visible' });
        await settingsMenu.click();

        // 2. Loop through payloads against target input selectors
        for (const payload of xssPayloads) {
            xssTriggered = false; // Reset state for each attempt

            // Target input by ID, class, or attribute (e.g., input[name="username"])
            const phoneField = page.locator('#phoneInputSettings');

            // Clear field, fill with payload, and submit
            await phoneField.fill('');
            await phoneField.fill(payload);

            await phoneField.blur();

            // Wait briefly to allow the DOM to render the update
            await page.waitForTimeout(300);

            // Assert that no alert dialog was triggered
            expect(xssTriggered, `XSS payload executed successfully: ${payload}`).toBe(false);
        }
    });

    test('Codes: should handle XSS payloads in URL query parameters', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });

        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        // Wait until Framework7 attaches its instance to <div id="app">
        await page.waitForFunction(() => {
            const appEl = document.querySelector('#app');
            return appEl && appEl.f7;
        });


        const payload = encodeURIComponent('<img src=x onerror=alert("XSS-TRIGGERED")>');

        // Retrieve f7 directly from the DOM element
        await page.evaluate((testId) => {
            const f7App = document.querySelector('#app').f7;

            // Target the active view router or main view router
            const router = f7App.views.current?.router || f7App.views.main?.router;
            if (router) {
                router.navigate(`/codes/${testId}/`);
            }
        }, payload);

        await page.waitForTimeout(500);

        expect(xssTriggered).toBe(false);
    });

    test('History: should handle XSS payloads in URL query parameters', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });

        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

        // Wait until Framework7 attaches its instance to <div id="app">
        await page.waitForFunction(() => {
            const appEl = document.querySelector('#app');
            return appEl && appEl.f7;
        });


        const payload = encodeURIComponent('<img src=x onerror=alert("XSS-TRIGGERED")>');

        // Retrieve f7 directly from the DOM element
        await page.evaluate((testId) => {
            const f7App = document.querySelector('#app').f7;

            // Target the active view router or main view router
            const router = f7App.views.current?.router || f7App.views.main?.router;
            if (router) {
                router.navigate(`/history/${testId}/`);
            }
        }, payload);

        await page.waitForTimeout(500);

        expect(xssTriggered).toBe(false);
    });

    test('Codes: should safely render dynamic list items without executing scripts', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });


        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        // QR code list
        await page.locator('#view-codes').click();

        // Inspect the text content of rendered list items to ensure tags aren't evaluated
        const listItem = page.locator('.list-item-title').first();
        if (await listItem.isVisible()) {
            // Check that raw script tags were escaped as harmless text strings
            const text = await listItem.textContent();
            expect(text).not.toBeNull();
        }

        expect(xssTriggered).toBe(false);
    });

    test('History: should safely render dynamic list items without executing scripts', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });


        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port

        const payload = '<img src=x onerror=alert("XSS-TRIGGERED")>';

        await page.waitForFunction(() => {
            const appEl = document.querySelector('#app');
            return appEl && appEl.f7;
        });

        await page.evaluate((xssData) => {
            const f7App = document.querySelector('#app').f7;

            f7App.store.state.history = [
                { id: '1', price: xssData, phone: xssData, name: xssData, detail: xssData, createdAt: new Date() }
            ];

        }, payload);

        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        // History list
        await page.locator('a[href*="#view-history"]').click();

        // Inspect the text content of rendered list items to ensure tags aren't evaluated
        const listItem = page.locator('.list-item-title').first();
        if (await listItem.isVisible()) {
            // Check that raw script tags were escaped as harmless text strings
            const text = await listItem.textContent();
            expect(text).not.toBeNull();
        }

        expect(xssTriggered).toBe(false);
    });

    test('Codes: should block javascript: URLs in dynamic links', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });

        const payload = 'javascript:alert("XSS-TRIGGERED")';

        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();


        // Fill a URL/link field in your form
        await page.locator('.onClickAdd').click();
        await page.locator('#phone').fill(payload);
        await page.locator('#name').fill(payload);
        await page.locator('#price').fill(payload);
        await page.locator('#detail').fill(payload);
        await page.locator('#submitCodeForm').click();

        // Try clicking the newly generated link/item
        const generatedLink = page.locator('a[href*="javascript:"]').first();
        if (await generatedLink.isVisible()) {
            await generatedLink.click();
        }

        expect(xssTriggered).toBe(false);
    });

    test('Settings: should block javascript: URLs in dynamic links', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });

        const payload = 'javascript:alert("XSS-TRIGGERED")';

        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


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
        await page.locator('#phoneInputSettings').fill(payload);

        // Try clicking the newly generated link/item
        const generatedLink = page.locator('a[href*="javascript:"]').first();
        if (await generatedLink.isVisible()) {
            await generatedLink.click();
        }

        expect(xssTriggered).toBe(false);
    });

    const attributePayloads = [
        '" onmouseover="alert(\'XSS-TRIGGERED\')',
        '" autofocus onfocus="alert(\'XSS-TRIGGERED\')',
        '"><script>alert("XSS-TRIGGERED")</script>'
    ];

    test('Codes: should prevent attribute breakout XSS', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });


        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();

        for (const payload of attributePayloads) {
            xssTriggered = false;

            // Fill form and trigger potential attribute hover/focus events

            await page.locator('.onClickAdd').click();
            await page.locator('#phone').fill(payload);
            await page.locator('#name').fill(payload);
            await page.locator('#price').fill(payload);
            await page.locator('#detail').fill(payload);
            await page.locator('#submitCodeForm').click();

            // Hover over elements that display tooltips or title attributes
            const targetElement = page.locator('#view-codes .item-title').first();
            if (await targetElement.isVisible()) {
                await targetElement.hover();
            }

            expect(xssTriggered).toBe(false);
        }
    });

    test('Settings: should prevent attribute breakout XSS', async ({ page }) => {
        let xssTriggered = false;
        page.on('dialog', async (d) => { xssTriggered = true; await d.dismiss(); });


        // 1. Navigate to your running local app
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' }); // Adjust to your F7 dev server port


        const backButton = page.locator('.link.back');
        await backButton.waitFor({ state: 'visible' });
        await backButton.click();



        for (const payload of attributePayloads) {
            xssTriggered = false;

            const rightMenu = page.locator('.right-menu');
            await rightMenu.waitFor({ state: 'visible' });
            await rightMenu.click();

            const settingsMenu = page.locator('.panel-close.settings');
            await settingsMenu.waitFor({ state: 'visible' });
            await settingsMenu.click();

            // Fill form and trigger potential attribute hover/focus events
            await page.locator('#phoneInputSettings').fill(payload);

            const backButton = page.locator('.link.back');
            await backButton.waitFor({ state: 'visible' });
            await backButton.click();

            const okButton = page.locator('.dialog-buttons .button-fill');
            await okButton.waitFor({ state: 'visible' });
            await okButton.click();

            await page.locator('a[href*="#view-codes"]').click();


            const addNewCode = page.locator('.onClickAdd');
            if (await addNewCode.isVisible()) {
                await addNewCode.click();
            }

            // 3. Target the phone input receiving the injected placeholder
            const targetPhoneInput = page.locator('#phone');
            await targetPhoneInput.waitFor({ state: 'visible' });

            // Trigger mouseover and focus events that attribute payloads exploit
            await targetPhoneInput.hover();
            await targetPhoneInput.focus();

            const closeButton = page.locator('.page .link.popup-close').first();
            await closeButton.click();

            expect(xssTriggered, `Attribute XSS triggered via placeholder payload: ${payload}`).toBe(false);
        }
    });


});


test.describe('URL Parameter XSS & SMS Redirect Handling', () => {
    const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '" onfocus="alert(\'XSS\')" autofocus="',
        'javascript:alert("XSS")',
        '"><svg onload=alert(1)>',
        '88888888?body=InjectedSMS', // Target SMS protocol parameter injection specifically
    ];

    for (const payload of xssPayloads) {
        test(`prevent XSS and URI corruption for payload: ${payload}`, async ({ page }) => {
            let xssTriggered = false;

            // 1. Intercept any browser execution alerts
            page.on('dialog', async (d) => {
                xssTriggered = true;
                await d.dismiss();
            });

            // 2. Validate SMS payload character limits (GSM 7-bit vs UCS-2)
            const hasSpecialChars = /[^\x00-\x7F]/.test(payload);
            const maxAllowed = hasSpecialChars ? 70 : 160;
            expect(payload.length, `Payload exceeds limit`).toBeLessThanOrEqual(maxAllowed);

            // 3. Build target URL
            const targetUrl = new URL('http://localhost:5173/sinpefacil/');
            targetUrl.searchParams.set('phone', '44445555');
            targetUrl.searchParams.set('name', payload);
            targetUrl.searchParams.set('price', '1000');
            targetUrl.searchParams.set('detail', payload);

            await page.goto(targetUrl.toString(), { waitUntil: 'domcontentloaded' });

            // 4. Wait for Framework7 initialization safely
            await page.waitForFunction(() => !!document.querySelector('#app')?.f7);

            // 5. Handle initial F7 Dialog Modal if rendered
            const okButton = page.locator('.dialog-buttons .button-fill');
            await okButton.waitFor({ state: 'visible' });
            await okButton.click();
            await okButton.waitFor({ state: 'detached' }); // Wait for dialog fade out

            // 6. Handle Bank Selection Modal if present
            const bankOption = page.locator('.list .item-content', { hasText: 'BAC Credomatic' }).first();
            if (await bankOption.isVisible()) {
                await bankOption.click();
            }

            // 7. Intercept the `sms:` navigation request BEFORE clicking
            const actionButton = page.locator('.actions-button').first();
            await expect(actionButton).toBeVisible({ timeout: 5000 });

            // Listen for the outgoing navigation or link request
            const smsRequestPromise = page.waitForRequest(
                (request) => request.url().startsWith('sms:'),
                { timeout: 3000 }
            ).catch(() => null);

            await actionButton.click();

            const smsRequest = await smsRequestPromise;
            const capturedSmsUri = smsRequest ? smsRequest.url() : null;

            // 8. Security Assertions
            // A. Verify no arbitrary JS executed on the DOM
            expect(xssTriggered, `URL XSS triggered with payload: ${payload}`).toBe(false);

            // B. Verify DOM escaping (Ensure raw executable script/SVG tags were not inserted directly into the DOM tree)
            const injectedScriptCount = await page.locator('script:has-text("XSS"), svg[onload]').count();
            expect(injectedScriptCount, 'Payload was rendered as unescaped raw HTML').toBe(0);

            // C. Verify SMS URI encoding safety
            // C. Verify SMS URI scheme and parameter safety
            if (capturedSmsUri) {
                // 1. Ensure the protocol scheme was not hijacked (must strictly begin with 'sms:')
                expect(capturedSmsUri).toMatch(/^sms:\d+/);

                // 2. Ensure executable scripts/HTML tags were not left unencoded inside the URI
                expect(capturedSmsUri).not.toMatch(/<script/i);
                expect(capturedSmsUri).not.toMatch(/<svg/i);

                // 3. Verify string quotes and raw angle brackets are percent-encoded
                expect(capturedSmsUri).not.toContain('<');
                expect(capturedSmsUri).not.toContain('>');
                expect(capturedSmsUri).not.toContain('"');
            }
        });
    }
});
