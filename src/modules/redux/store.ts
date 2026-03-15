import { configureStore } from "@reduxjs/toolkit";
import { appBootstrapSlice } from "@modules/app/slice";
import { WsConnectionProxy } from "@core/transport/WsConnectionProxy";
import { Connection } from "@core/transport/Connection";
import { changeConnectionStatus, subscriptionSlice } from "@core/transport/slice";
import { ConnectionStatus } from "@core/transport/types/ConnectionStatus";
import { refDataSlice } from "@modules/reference-data/slice";
import { selectionSlice } from "@modules/selection/slice.ts";

const connectionProxy = new WsConnectionProxy(
    import.meta.env["VITE_BITFINEX_WS_URL"] || "wss:api-pub.bitfinex.com/ws/2"
)

const connection = new Connection(connectionProxy);

function createStore() {
    const store = configureStore({
        reducer: {
            app: appBootstrapSlice.reducer,
            refData: refDataSlice.reducer,
            selection: selectionSlice.reducer,
            subscriptions: subscriptionSlice.reducer,
        },
        middleware: (getDefaultMiddleware) => 
            getDefaultMiddleware({
                thunk: {
                    extraArgument: { connection }
                }
            })
    })

    connection.onConnect(() => {
        store.dispatch(changeConnectionStatus(ConnectionStatus.Connected))
        console.log('Connected');
    });

    connection.onClose(() => {
        store.dispatch(changeConnectionStatus(ConnectionStatus.Disconnected))
        console.log('Disconnected – will auto-reconnect')
    });

    return store;
};

let storeInstance: ReturnType<typeof createStore> | null = null;

export const getStore = () => {
    if(!storeInstance) {
        storeInstance = createStore()
    }
    return storeInstance
};

export default getStore

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];