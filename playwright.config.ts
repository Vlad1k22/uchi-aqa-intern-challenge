import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ?? 'https://uchi.ru';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A production site may rate-limit parallel browser contexts.
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // The task targets the support widget on the original main page.
    // The redesign experiment can serve /index_v3 without loading this widget.
    storageState: {
      cookies: [{
        name: 'ab_mainpage_redesign',
        value: 'a',
        domain: new URL(baseURL).hostname,
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: new URL(baseURL).protocol === 'https:',
        sameSite: 'Lax',
      }],
      origins: [],
    },
    testIdAttribute: 'data-test',
    locale: 'ru-RU',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
