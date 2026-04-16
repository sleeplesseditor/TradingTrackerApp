import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Channel, type ChannelTypes } from "./types/Channels";
import { SubscriptionActionType, type SubscriptionActionTypes } from "./types/ActionTypes";
import type { Connection } from "./Connection";
import { ConnectionStatus } from "./types/connectionStatus";
import type { SubscribeMsg } from "./types/SubscribeMsg";

export type requestSubscribeToChannelAck = {
    channel: string
    event?: string
    key?: string
    prec?: string
    symbol?: string
}

export interface SubscriptionStatus {
    [channelId: number]: {
        channel: string
        isStale: boolean
        lastUpdate?: number
        request: requestSubscribeToChannelAck
    }
    wsConnectionStatus: ConnectionStatus
}

const initialState: SubscriptionStatus = {
    wsConnectionStatus: ConnectionStatus.Disconnected
};

interface SubscribePayload {
    symbol: string
    timeframe?: string
    prec?: string
};

const createSubscribeThunk = (channel: ChannelTypes, actionType: SubscriptionActionTypes) =>
    createAsyncThunk(actionType, async ({ symbol, timeframe, prec }: SubscribePayload, { extra }) => {
        const { connection } = extra as { connection: Connection }
        const msg: SubscribeMsg = {
            event: "subscribe",
            channel,
        }

        switch (channel) {
            case Channel.TICKER:
            case Channel.TRADES:
                msg.symbol = `t${symbol}`
                break
            case Channel.CANDLES:
                msg.key = `trade:${timeframe}:t${symbol}`
                break
            case Channel.BOOK:
                msg.prec = prec
                msg.symbol = `t${symbol}`
                break  
            default:
                console.warn("Unhandled channel:", channel)
        }

        connection.send(JSON.stringify(msg))
        return msg
});

export const tickerSubscribeToSymbol = createSubscribeThunk(
  Channel.TICKER,
  SubscriptionActionType.SUBSCRIBE_TO_TICKER
);

export const candlesSubscribeToSymbol = createSubscribeThunk(
  Channel.CANDLES,
  SubscriptionActionType.SUBSCRIBE_TO_CANDLES
);

export const tradeSubscribeToSymbol = createSubscribeThunk(
  Channel.TRADES,
  SubscriptionActionType.SUBSCRIBE_TO_TRADES
);

export const bookSubscribeToSymbol = createSubscribeThunk(
  Channel.BOOK,
  SubscriptionActionType.SUBSCRIBE_TO_BOOK
);

export const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {
        changeConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.wsConnectionStatus = action.payload
        },
        subscribeToChannelAcknowledge: (state, 
            action: PayloadAction<{
                channelId: number
                channel: ChannelTypes
                request: requestSubscribeToChannelAck
            }>
        ) => {
            const { channelId, channel, request } = action.payload;
            state[channelId] = { channel, request, isStale: false };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(tickerSubscribeToSymbol.fulfilled, (_state, action) => {
                // console.log(`Subscribed to ticker ${JSON.stringify(action.payload)}`)
            })
            .addCase(candlesSubscribeToSymbol.fulfilled, (_state, action) => {
                // console.log(`Subscribed to candle ${JSON.stringify(action.payload)}`)
            })
            .addCase(tradeSubscribeToSymbol.fulfilled, (_state, action) => {
                // console.log(`Subscribed to trade ${JSON.stringify(action.payload)}`)
            })
            .addCase(bookSubscribeToSymbol.fulfilled, (_state, action) => {
                // console.log(`Subscribed to book ${JSON.stringify(action.payload)}`)
            })
    }
})

export const { changeConnectionStatus, subscribeToChannelAcknowledge } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;