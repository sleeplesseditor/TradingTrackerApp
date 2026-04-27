import { ConnectionHealth, usePerformanceMonitor } from "../usePerformanceMonitor";
import { performanceTracker } from "@services/performanceTracker";
import { Channel } from "@core/transport/types/Channels";
import { renderHook } from "@testing-library/react";

describe('usePerformanceMonitor', () => {
    it('should initialize with default metrics', () => {
        const { result } = renderHook(() => usePerformanceMonitor());
        expect(result.current).toEqual({
            fps: 0,
            memory: 0,
            dataLatencies: {
                trades: 0,
                tickers: 0,
                orderBook: 0,
                candles: 0,
            },
            connectionHealth: ConnectionHealth.GOOD,
        });
    });

    it('should update data latencies and connection health on performanceTracker updates', () => {
        const { result } = renderHook(() => usePerformanceMonitor());

        // Simulate performanceTracker updates
        performanceTracker.subscribe(Channel.TRADES, (latency) => {
            expect(result.current.dataLatencies.trades).toBe(latency);
        });

        performanceTracker.subscribe(Channel.TICKER, (latency) => {
            expect(result.current.dataLatencies.tickers).toBe(latency);
        });

        performanceTracker.subscribe(Channel.BOOK, (latency) => {
            expect(result.current.dataLatencies.orderBook).toBe(latency);
        });

        performanceTracker.subscribe(Channel.CANDLES, (latency) => {
            expect(result.current.dataLatencies.candles).toBe(latency);
        });
    });
});