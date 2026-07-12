import { expect, test } from '@playwright/test';

test.describe('settings updates timer behavior', () => {
  test('changing work=3 and rest=5 updates workout intervals', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    await page.getByLabel('Work (seconds)').fill('3');
    await page.getByLabel('Rest (seconds)').fill('5');

    await page.getByRole('button', { name: 'Close' }).click();

    const timerDisplay = page.getByTestId('timer-display');

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work', { timeout: 6_000 });

    // Skip from work -> rest and verify rest duration starts at configured 5 seconds.
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('rest');
    await expect(timerDisplay).toHaveText('00:05');

    // Skip from rest -> work and verify work duration resets to configured 3 seconds.
    await page.waitForTimeout(1_000);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work');
    await expect(timerDisplay).toHaveText('00:03');
  });
});
