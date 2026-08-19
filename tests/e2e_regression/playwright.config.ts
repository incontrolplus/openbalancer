import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'reports/latest-html'), open: 'never' }],
    ['json', { outputFile: path.join(__dirname, 'reports/results.json') }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3117',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
