import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ConnectionStatus } from "./types/connectionStatus";

export interface SubscriptionStatus {
    wsConnectionStatus: ConnectionStatus
}

const initialState: SubscriptionStatus = {
    wsConnectionStatus: ConnectionStatus.Disconnected
}

export const subscriptionSlice = createSlice({
    name: "subscriptions",
    initialState,
    reducers: {
        changeConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.wsConnectionStatus = action.payload
        }
    }
})

export const { changeConnectionStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;