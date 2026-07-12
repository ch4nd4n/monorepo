import { expect, test } from '@playwright/test';

test.describe('voice commands panel', () => {
  test('lists all six commands with the wake-word hint and closes', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Voice Commands' }).click();

    await expect(page.getByText('before every command', { exact: false })).toBeVisible();

    for (const phrase of ['Clock, start', 'Clock, pause', 'Clock, resume', 'Clock, next', 'Clock, stop', 'Clock, reset']) {
      await expect(page.getByText(phrase, { exact: true })).toBeVisible();
    }

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Voice Commands' })).toHaveCount(0);
  });

  test('renders correctly in light theme', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Light' }).click();
    await page.getByRole('button', { name: 'Voice Commands' }).click();

    await expect(page.getByText('Clock, start', { exact: true })).toBeVisible();
  });
});
