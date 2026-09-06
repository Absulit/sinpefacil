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

test.describe('Security & Application Hardening', () => {

    test('Verify CSP meta tag in HTML', async ({ page }) => {
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
        const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]');
        await expect(cspMeta).toHaveAttribute('content', /object-src 'none'/);
    });

});



test.describe('SINPE Protocol & Storage Security', () => {
    test('Prevent parameter splitting in generated SMS links', async ({ page }) => {
        // 1. Hook into window to expose generateSINPESMS globally when Vite loads it
        await page.addInitScript(() => {
            let fn = null;
            Object.defineProperty(window, 'generateSINPESMS', {
                get: () => fn,
                set: (val) => { fn = val; },
                configurable: true
            });
        });

        await page.goto('http://localhost:5173/sinpefacil/', { waitUntil: 'domcontentloaded' });

        // 2. Wait for Vite/Framework7 to finish loading modules
        await page.waitForFunction(() => typeof window.generateSINPESMS === 'function');

        // 3. Execute the function directly and get the returned string
        const capturedSmsUri = await page.evaluate(() => {
            return window.generateSINPESMS(
                '88888888',
                '1000',
                '44444444',
                'Product?phone=99999999&body=HIJACKED',
                ''
            );
        });

        // Security Assertions
        expect(capturedSmsUri).not.toBeNull();
        expect(typeof capturedSmsUri).toBe('string');
        expect(capturedSmsUri).not.toMatch(/sms:\d+\?.*(?<!%3F)\?/i);
        expect(capturedSmsUri).toContain('%3Fphone%3D99999999');
    });

    //     test('Gracefully handle corrupted data in LocalStorage', async ({ page }) => {
    //         // Pre-seed local storage with dangerous/malformed state before loading
    //         await page.addInitScript(() => {
    //             window.localStorage.setItem('sinpe_saved_qrs', '{"malicious": "<script>alert(1)</script>"}');
    //             window.localStorage.setItem('sinpe_settings', 'INVALID_NOT_JSON{{{');
    //         });

    //         await page.goto('http://localhost:5173/sinpefacil/');

    //         // Assert app UI still renders cleanly without crashing or throwing unhandled errors
    //         await expect(page.locator('#app')).toBeVisible();
    //         await expect(page.locator('.view-main')).toBeVisible();
    //     });

});
