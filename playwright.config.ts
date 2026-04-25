import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './src/tests/e2e',
  testMatch: /.*\.spec\.ts/,
  use: {
    baseURL: 'http://127.0.0.1:4173/TradingTrackerApp/',
    headless: true,
    launchOptions: { channel: 'chromium' },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/TradingTrackerApp/',
    reuseExistingServer: !process.env.CI,
  },
});