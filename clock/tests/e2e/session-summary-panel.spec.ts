import { expect, test } from '@playwright/test';

test.describe('session summary panel', () => {
  test('shows the empty state before any session has run', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Summary' }).click();

    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();
    await expect(page.getByText('No summary yet.', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: 'Session Summary' })).toHaveCount(0);
  });

  test('shows elapsed, rounds, started and ended stats after stopping a session', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Stop' }).click();

    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();
    await expect(page.getByText('Workout complete')).toBeVisible();
    await expect(page.getByText('Elapsed', { exact: true })).toBeVisible();
    await expect(page.getByText('Rounds completed', { exact: true })).toBeVisible();
    await expect(page.getByText('Started', { exact: true })).toBeVisible();
    await expect(page.getByText('Ended', { exact: true })).toBeVisible();
  });

  test('renders correctly in light theme', async ({ page }) => {
    await page.goto('/workout');

    await page.getByRole('button', { name: 'Light' }).click();
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByRole('button', { name: 'Stop' }).click();

    await expect(page.getByRole('heading', { name: 'Session Summary' })).toBeVisible();
    await expect(page.getByText('Workout complete')).toBeVisible();
  });
});
