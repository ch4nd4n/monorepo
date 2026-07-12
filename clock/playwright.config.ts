import { defineConfig, devices } from '@playwright/test';

const slowMoMs = Number(process.env.PW_SLOW_MO ?? '0');

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: Number.isFinite(slowMoMs) ? slowMoMs : 0,
    },
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 4173',
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
