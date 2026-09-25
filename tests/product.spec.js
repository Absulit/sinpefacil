import { test, expect } from '@playwright/test';

test('editing product updates all the fields in the product page view', async ({ page }) => {
    await page.goto('http://localhost:5173/sinpefacil/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('div[data-name="about"]')).toBeVisible();
    await page.reload();

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

    const listItem = page.locator('.list .item-link.item-content').first();

    if (await listItem.isVisible()) {
        await listItem.click();

        // update with the following data and check if the update was successful
        const phone = '88888888';
        const name = 'Popcorn 2 🍿';
        const price = '2613';
        const detail = 'Popcorn from Aunt W Mega factory';


        await page.locator('#btn-edit').click();

        await page.locator('#submitCodeForm').waitFor({ state: 'visible' });

        await page.locator('#phone').fill(phone);
        await page.locator('#name').fill(name);
        await page.locator('#price').fill(price);
        await page.locator('#detail').fill(detail);

        await page.locator('#submitCodeForm').click();

        const nameEl = page.locator('.card-header.name');
        const content = page.locator('.grid.grid-cols-2.grid-gap');
        const phoneEl = content.locator('.phone');
        const priceEl = content.locator('.price');
        const detailEl = content.locator('.detail');

        await expect(nameEl).toHaveText(name);
        await expect(phoneEl).toHaveText(phone);
        await expect(priceEl).toHaveText(`₡${price}`);
        await expect(detailEl).toHaveText(detail);

    }

});