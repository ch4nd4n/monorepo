import { expect, test } from '@playwright/test';

test.describe('workout clock core flows', () => {
  test('manual start and stop shows summary', async ({ page }) => {
    await page.goto('/workout?panel=summary');

    await expect(page.getByRole('heading', { name: 'Voice Workout Clock' })).toBeVisible();

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByText('Started')).toBeVisible();

    await page.getByRole('button', { name: 'Stop' }).click();
    await expect(page.getByText('Elapsed:')).toBeVisible();
    await expect(page.getByText('Rounds completed:')).toBeVisible();
  });

  test('settings panel is url addressable', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByLabel('Rounds')).toBeVisible();
  });

  test('shows duration warning when preferred max is exceeded', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    const preferredMaxInput = page.getByLabel('Preferred max session (minutes)');
    await preferredMaxInput.fill('1');

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(
      page.getByText('Warning: estimated workout', { exact: false }),
    ).toBeVisible();
  });

  test('debug panel can be toggled', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Show Debug' }).click();
    await expect(page.getByRole('heading', { name: 'Debug' })).toBeVisible();

    await page.getByRole('button', { name: 'Hide Debug' }).click();
    await expect(page.getByRole('heading', { name: 'Debug' })).toHaveCount(0);
  });
});
