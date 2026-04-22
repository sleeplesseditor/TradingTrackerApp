import { configureStore } from "@reduxjs/toolkit";
import { appBootstrapSlice } from "@modules/app/slice";
import { bookSlice } from "@modules/book/slice";
import { tradesSlice } from "@modules/trades/slice";
import { tickerSlice } from "@modules/tickers/slice";
import { candleSlice } from "@modules/candles/slice";
import { subscriptionSlice } from "@core/transport/slice";
import { refDataSlice } from "@modules/reference-data/slice";
import { selectionSlice } from "@modules/selection/slice";

const mockConnection = {
    send: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    onMessage: jest.fn(),
    onError: jest.fn(),
    onOpen: jest.fn(),
    onClose: jest.fn(),
};

describe("Redux Integration", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        app: appBootstrapSlice.reducer,
        trades: tradesSlice.reducer,
        ticker: tickerSlice.reducer,
        candles: candleSlice.reducer,
        subscriptions: subscriptionSlice.reducer,
        refData: refDataSlice.reducer,
        selection: selectionSlice.reducer,
        book: bookSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: {
            extraArgument: { connection: mockConnection },
          },
        }),
    })
  });

  it("should maintain data consistency across updates", () => {
    // Initial trade
    store.dispatch(
      tradesSlice.actions.tradesUpdateReducer({
        currencyPair: "BTCUSD",
        trade: { id: 1, timestamp: 1640995200000, amount: 0.5, price: 45000 },
      })
    )

    // Update same trade
    store.dispatch(
      tradesSlice.actions.tradesUpdateReducer({
        currencyPair: "BTCUSD",
        trade: { id: 1, timestamp: 1640995200000, amount: 0.5, price: 45100 },
      })
    )

    const state = store.getState();

    expect(state.trades.BTCUSD).toHaveLength(1); // Should not duplicate
    expect(state.trades.BTCUSD[0].price).toBe(45100); // Should be updated
  })
});