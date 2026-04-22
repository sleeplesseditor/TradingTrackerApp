import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { vi } from "vitest";

configure({ testIdAttribute: "data-testid" });

Object.assign(globalThis, { jest: vi });

// WebSocket Global Mock
Object.defineProperty(window, "WebSocket", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        close: vi.fn(),
        send: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        readyState: WebSocket.OPEN,
    })),
});

// HighCharts Mock
vi.mock("highcharts/highstock", () => ({
    default: {
        stockChart: vi.fn(),
        setOptions: vi.fn(),
    },
}));

// ResizeObserver Mock
Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
});

// Environment Variables Mocks
vi.mock("../config/env", () => ({
    config: {
        BITFINEX_WS_URL: "ws://localhost:8080",
        MAX_TRADES: 1000,
        MAX_CANDLES: 5000,
        IS_PRODUCTION: false,
    },
}));

// formatCurrencyPair Mock
vi.mock("@modules/reference-data/utils", () => ({
    formatCurrencyPair: (currencyPair: string) => `Formatted(${currencyPair})`
}));