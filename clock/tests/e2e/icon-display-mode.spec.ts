import { expect, test } from '@playwright/test';

test.describe('icon display mode', () => {
  test('defaults to icons with text, so control buttons keep their visible labels', async ({ page }) => {
    await page.goto('/workout');

    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();
    await expect(startButton).toContainText('Start');
    await expect(startButton.locator('svg')).toBeVisible();
  });

  test('switching to icons only hides visible text but keeps the accessible name and button size', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    const startButtonBefore = page.getByRole('button', { name: 'Start' });
    const boxBefore = await startButtonBefore.boundingBox();

    await page.getByRole('button', { name: 'Icons only' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();
    // Accessible name is still "Start" (via aria-label), but no visible text renders.
    await expect(startButton).toHaveText('');
    await expect(startButton.locator('svg')).toBeVisible();

    const boxAfter = await startButton.boundingBox();
    expect(boxBefore).not.toBeNull();
    expect(boxAfter).not.toBeNull();
    expect(boxAfter!.height).toBeCloseTo(boxBefore!.height, 0);
  });

  test('switching to text only removes icons entirely', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    await page.getByRole('button', { name: 'Text only' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();
    await expect(startButton).toContainText('Start');
    await expect(startButton.locator('svg')).toHaveCount(0);
  });

  test('icon display mode persists across the settings panel and applies to utility actions', async ({ page }) => {
    await page.goto('/workout?panel=settings');

    await page.getByRole('button', { name: 'Icons only' }).click();
    await page.getByRole('button', { name: 'Close' }).click();

    const enableVoiceButton = page.getByRole('button', { name: 'Enable' });
    await expect(enableVoiceButton).toBeVisible();
    await expect(enableVoiceButton).toHaveText('');
    await expect(enableVoiceButton.locator('svg')).toBeVisible();
  });
});
