import { test, expect } from "@playwright/test";

test.describe("Trading Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        // Mock WebSocket server
        await page.route("wss://api-pub.bitfinex.com/ws/2", (route) => {
            // Mock WebSocket connection
            route.fulfill({ status: 101 })
        });

        await page.goto("/TradingTrackerApp/");
    });

    test("should display main dashboard components", async ({ page }) => {
        // Check header
        await expect(page.locator('.trading-tracker__header')).toBeVisible();

        // Check ticker panel
        await expect(page.locator('.trading-tracker__tickers-panel')).toBeVisible();

        // Check trades panel
        await expect(page.locator('.trading-tracker__trades-panel')).toBeVisible();

        // Check chart panel
        await expect(page.locator('.trading-tracker__candles-panel')).toBeVisible();
    })

    test("should display a loading state", async ({ page }) => {
        await page.evaluate(() => {
        // Simulate WebSocket connection
        const mockWs = {
            send: () => {},
            close: () => {},
            addEventListener: (event: string, handler: Function) => {
                if (event === "open") {
                    setTimeout(() => handler({}), 100)
                } else if (event === "message") {
                // Simulate subscription acknowledgment
                    setTimeout(() => {
                        handler({
                            data: JSON.stringify({
                                event: "subscribed",
                                channel: "trades",
                                chanId: 12345,
                                symbol: "tBTCUSD",
                            }),
                        })
                    }, 200);

                    // Simulate trade data
                    setTimeout(() => {
                        handler({
                            data: JSON.stringify([12345, [[419251686, Date.now(), 0.005, 45000]]]),
                        })
                    }, 300);
                }
            },
        }

        // Replace WebSocket constructor
        ;(window as any).WebSocket = function () {
            return mockWs
        }
    });

        // Wait for data to load
        await page.waitForTimeout(1000);

        // Check for presence of loading indicator
        await expect(page.getByText(/loading/i).first()).toBeVisible();
    });

    test("should handle chart interactions", async ({ page }) => {
        // Wait for chart to load
        await page.waitForSelector('.candles-chart');

        // Test zoom functionality
        const chart = page.locator('.candles-chart');

        // Simulate mouse wheel zoom
        await chart.hover();
        await page.mouse.wheel(0, -100);

        const rangeSelector = page.locator('.highcharts-range-input').first();

        // Test range selector
        await rangeSelector.click();

        // Verify chart updates
        await expect(chart).toBeVisible();
    })

    test("should be responsive on different screen sizes", async ({ page }) => {
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });

        await expect(page.locator('.trading-tracker__header')).toBeVisible();
        await expect(page.locator('.trading-tracker__tickers-panel')).toBeVisible();

        // Test tablet view
        await page.setViewportSize({ width: 768, height: 1024 });

        await expect(page.locator('.trading-tracker__trades-panel')).toBeVisible();

        // Test desktop view
        await page.setViewportSize({ width: 1920, height: 1080 });

        // All panels should be visible in desktop layout
        await expect(page.locator('.trading-tracker__header')).toBeVisible();
        await expect(page.locator('.trading-tracker__tickers-panel')).toBeVisible();
        await expect(page.locator('.trading-tracker__trades-panel')).toBeVisible();
        await expect(page.locator('.trading-tracker__candles-panel')).toBeVisible();
    });
});