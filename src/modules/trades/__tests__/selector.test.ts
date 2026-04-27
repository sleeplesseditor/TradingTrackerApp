import { getTradesForSelectedPair } from "@modules/trades/selector";
import type { RootState } from "../../redux/store"

describe("trades selectors", () => {
    const mockState: Partial<RootState> = {
        trades: {
            BTCUSD: [
                { id: 1, timestamp: 1640995200000, amount: 0.5, price: 45000 },
                { id: 2, timestamp: 1640995300000, amount: 0.3, price: 45100 },
                { id: 3, timestamp: 1640995400000, amount: 0.8, price: 44900 },
            ],
            ETHUSD: [{ id: 4, timestamp: 1640995200000, amount: 2.0, price: 3500 }],
        },
    };

    describe("getTradesForSelectedPair", () => {
        it("should return trades for the selected currency pair", () => {
            const selectedCurrencyPair = "BTCUSD";
            const result = getTradesForSelectedPair.resultFunc(mockState.trades!, selectedCurrencyPair);

            expect(result).toHaveLength(3);
            expect(result[0].id).toBe(1);
        });

        it("should return empty array if there are no trades for the selected pair", () => {
            const selectedCurrencyPair = "NONEXISTENT";
            const emptyResult = getTradesForSelectedPair.resultFunc(mockState.trades!, selectedCurrencyPair);

            expect(emptyResult).toEqual([]);
        });

        it("should return empty array if the selected pair is null", () => {
            const selectedCurrencyPair = null;
            const nullResult = getTradesForSelectedPair.resultFunc(mockState.trades!, selectedCurrencyPair as any);

            expect(nullResult).toEqual([]);
        });
    });
});