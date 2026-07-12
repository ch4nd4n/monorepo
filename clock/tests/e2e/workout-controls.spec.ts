import { expect, test } from '@playwright/test';

test.describe('workout clock controls', () => {
  test('start waits in preroll, then countdown runs, then stop shows summary', async ({ page }) => {
    await page.goto('/workout');

    const timerDisplay = page.locator('section').first().locator('div').first();

    await page.getByRole('button', { name: 'Start' }).click();

    // During preroll we should be in preroll phase and show pause as primary control.
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('preroll');
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    // Wait until preroll finishes and work countdown starts.
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work', { timeout: 6_000 });

    const before = await timerDisplay.textContent();
    await page.waitForTimeout(1_300);
    const after = await timerDisplay.textContent();

    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect(after).not.toEqual(before);

    await page.getByRole('button', { name: 'Stop' }).click();

    // After stop, summary should open and primary control should return to Start.
    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();
    await expect(page.getByText('Elapsed:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('stop freezes countdown and keeps it stable for 3 seconds', async ({ page }) => {
    await page.goto('/workout');

    const timerDisplay = page.locator('section').first().locator('div').first();

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work', { timeout: 6_000 });

    await page.getByRole('button', { name: 'Stop' }).click();

    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();

    const stoppedValue = await timerDisplay.textContent();
    await page.waitForTimeout(3_000);
    const afterWaitValue = await timerDisplay.textContent();

    expect(stoppedValue).not.toBeNull();
    expect(afterWaitValue).not.toBeNull();
    expect(afterWaitValue).toEqual(stoppedValue);
  });

  test('stop works reliably across repeated start/stop cycles', async ({ page }) => {
    await page.goto('/workout');

    for (let i = 0; i < 5; i += 1) {
      await page.getByRole('button', { name: 'Start' }).click();
      await page.getByRole('button', { name: 'Stop' }).click();

      await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();

      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page.getByRole('heading', { name: 'Session Summary' })).toHaveCount(0);
    }
  });
  test('can start workout manually', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Start' }).click();

    await expect(page.getByText('Started')).toBeVisible();
    await expect(page.getByText(/Phase:/)).toBeVisible();
  });

  test('primary control toggles start, pause, continue', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();

    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByText('Paused')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Resumed')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  });

  test('can stop workout and view summary', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Stop' }).click();

    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();
    await expect(page.getByText('Elapsed:')).toBeVisible();
    await expect(page.getByText('Rounds completed:')).toBeVisible();
  });

  test('can skip to next interval', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByText('Skipped to next interval')).toBeVisible();
  });

  test('reset returns to idle baseline and freezes countdown for 3 seconds', async ({ page }) => {
    await page.goto('/workout');

    const timerDisplay = page.locator('section').first().locator('div').first();

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work', { timeout: 6_000 });

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.getByText('Workout reset')).toBeVisible();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('idle');
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

    const resetValue = await timerDisplay.textContent();
    expect(resetValue).toBe('00:30');

    await page.waitForTimeout(3_000);
    const afterWaitValue = await timerDisplay.textContent();
    expect(afterWaitValue).toEqual(resetValue);
  });

  test('at 00:28 pause, next, and reset behave as expected', async ({ page }) => {
    await page.goto('/workout');

    const timerDisplay = page.locator('section').first().locator('div').first();

    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('work', { timeout: 6_000 });
    await expect(timerDisplay).toHaveText('00:28', { timeout: 6_000 });

    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByText('Paused')).toBeVisible();

    const pausedValue = await timerDisplay.textContent();
    await page.waitForTimeout(1_300);
    await expect(timerDisplay).toHaveText(pausedValue ?? '');

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Skipped to next interval')).toBeVisible();

    const afterNextValue = await timerDisplay.textContent();
    expect(afterNextValue).not.toBeNull();
    expect(afterNextValue).toEqual(pausedValue);
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText('Workout reset')).toBeVisible();
    await expect(page.getByText('Phase:').locator('strong')).toHaveText('idle');
    await expect(timerDisplay).toHaveText('00:30');
  });
});
