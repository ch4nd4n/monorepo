import { expect, test } from '@playwright/test';

async function clickTimes(locator: import('@playwright/test').Locator, times: number): Promise<void> {
  for (let i = 0; i < times; i += 1) {
    await locator.click();
  }
}

test.describe('settings updates timer behavior', () => {
  test('changing work=3 and rest=5 updates workout intervals', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    // Default work is 30s, rest is 10s; step down to 3s and 5s via the steppers.
    await clickTimes(page.getByRole('button', { name: 'Decrease Work (seconds)' }), 27);
    await clickTimes(page.getByRole('button', { name: 'Decrease Rest (seconds)' }), 5);

    await page.getByRole('button', { name: 'Close' }).click();

    const timerDisplay = page.getByTestId('timer-display');

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByTestId('phase-value')).toHaveText(/work/i, { timeout: 6_000 });

    // Skip from work -> rest and verify rest duration starts at configured 5 seconds.
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByTestId('phase-value')).toHaveText(/rest/i);
    await expect(timerDisplay).toHaveText('00:05');

    // Skip from rest -> work and verify work duration resets to configured 3 seconds.
    await page.waitForTimeout(1_000);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByTestId('phase-value')).toHaveText(/work/i);
    await expect(timerDisplay).toHaveText('00:03');
  });
});
