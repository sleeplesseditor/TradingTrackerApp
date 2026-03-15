import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { SUBSCRIPTION_TIMEOUT_IN_MS } from "@modules/app/slice";
import { bookSubscribeToSymbol, tradeSubscribeToSymbol } from "@core/transport/slice";

interface CurrencyPairState {
  currencyPair: string
}

const initialState: CurrencyPairState = {
  currencyPair: "",
};

export const selectCurrencyPair = createAsyncThunk(
    "selection/selectCurrencyPair",
    async ({ currencyPair }: { currencyPair: string }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(selectionSlice.actions.setCurrencyPair({ currencyPair }))
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    dispatch(tradeSubscribeToSymbol({ symbol: currencyPair }));
                    dispatch(bookSubscribeToSymbol({ symbol: currencyPair, prec: "R0" }));
                    resolve()
                }, SUBSCRIPTION_TIMEOUT_IN_MS)
            })
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
        }
    }
)

export const selectionSlice = createSlice({
    name: "selection",
    initialState,
    reducers: {
        setCurrencyPair: (state, action: PayloadAction<{ currencyPair: string }>) => {
            const { currencyPair } = action.payload
            state.currencyPair = currencyPair;
        },
    },
})

export default selectionSlice.reducer;