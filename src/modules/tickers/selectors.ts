import { range } from "lodash";
import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "@modules/redux/store";
import { type Ticker } from "@modules/tickers/types/Ticker";
import { getCurrencyPairs } from "@modules/reference-data/selectors";
import { getSelectedCurrencyPair } from "@modules/selection/selector";
import { candlesSelector } from "@modules/candles/selector";
import { getValueAt } from "@core/utils";
import { getLookupKey } from "@modules/candles/utils";
import { DEFAULT_TIMEFRAME } from "@modules/app/slice";

const tickerSelector = (state: RootState) => state.ticker;

export const getTicker = createSelector(tickerSelector, (ticker) => (symbol: string) => ticker[symbol]);

export const getTickers = createSelector(getCurrencyPairs, tickerSelector, (currencyPairs, ticker) =>
    currencyPairs.map((currencyPair) => ({
            ...ticker[currencyPair],
            currencyPair,
        }))
        .filter((item): item is Ticker & { currencyPair: string } =>
            item.lastPrice !== undefined &&
            item.dailyChange !== undefined &&
            item.dailyChangeRelative !== undefined
        )
)

export const getVisibleCurrencyPairTickers = createSelector(getCurrencyPairs, getSelectedCurrencyPair, (allCurrencyPairs, selectedCurrencyPair) => {
    let currencyPairs: string[] = [];

    console.log('allCurrencyPairs', allCurrencyPairs)

    const selectedCurrencyPairIndex = allCurrencyPairs.indexOf(selectedCurrencyPair || "");

    // Pick a few currency pairs on each side of the selected one
    if (selectedCurrencyPairIndex >= 0) {
        currencyPairs = allCurrencyPairs
    }

    return {
        currencyPairs,
        selectedCurrencyPairIndex,
    }
  }
)

export const getTickersWithPrices = createSelector(getTickers, candlesSelector, (tickers, candles) => {
    return tickers.map((ticker) => ({
        ...ticker,
        prices: (candles[getLookupKey(ticker.currencyPair, DEFAULT_TIMEFRAME)] || []).map((candle) => candle.close),
    }))
});