import { expect, test } from '@playwright/test';

const MOCKUP_FILE_URL = 'file:///Users/chandan/Downloads/Kairos%20App%20(standalone).html';

test.describe('visual fidelity', () => {
  test('captures current app hero for side-by-side review', async ({ page }) => {
    await page.goto('/workout');

    await expect(page.getByRole('heading', { name: 'Kairos' })).toBeVisible();

    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page).toHaveScreenshot('kairos-app-hero.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.2,
    });
  });

  test('captures standalone mockup reference frame', async ({ page }) => {
    await page.goto(MOCKUP_FILE_URL);

    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page).toHaveScreenshot('kairos-mockup-reference.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.2,
    });
  });
});
