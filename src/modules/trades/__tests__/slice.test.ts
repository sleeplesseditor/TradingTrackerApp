import { describe, it, expect } from "vitest";
import { tradesSlice, tradesUpdateReducer } from "../slice";
import type { Trade } from "../types/Trade";

describe("tradesSlice", () => {
  const mockTrade: Trade = {
    id: 123456,
    timestamp: 1640995200000,
    amount: 0.5,
    price: 45000,
  }

  describe("tradesUpdateReducer", () => {
    it("should add new trade to existing list", () => {
      const existingState = {
        BTCUSD: [mockTrade],
      }

      const newTrade = { ...mockTrade, id: 789, timestamp: 1640995300000 }
      const action = tradesUpdateReducer({ currencyPair: "BTCUSD", trade: newTrade })

      const result = tradesSlice.reducer(existingState, action)

      expect(result.BTCUSD).toHaveLength(2)
      expect(result.BTCUSD[1]).toEqual(newTrade)
    })

    it("should update existing trade with same ID", () => {
      const existingState = {
        BTCUSD: [mockTrade],
      }

      const updatedTrade = { ...mockTrade, price: 46000 }
      const action = tradesUpdateReducer({ currencyPair: "BTCUSD", trade: updatedTrade })

      const result = tradesSlice.reducer(existingState, action)

      expect(result.BTCUSD).toHaveLength(1)
      expect(result.BTCUSD[0].price).toBe(46000)
    })

    it("should maintain chronological order after adding", () => {
      const existingState = {
        BTCUSD: [
          { ...mockTrade, id: 1, timestamp: 1640995200000 },
          { ...mockTrade, id: 3, timestamp: 1640995400000 },
        ],
      }

      const middleTrade = { ...mockTrade, id: 2, timestamp: 1640995300000 }
      const action = tradesUpdateReducer({ currencyPair: "BTCUSD", trade: middleTrade })

      const result = tradesSlice.reducer(existingState, action)

      expect(result.BTCUSD.map((t) => t.id)).toEqual([1, 2, 3])
    })
  })
})