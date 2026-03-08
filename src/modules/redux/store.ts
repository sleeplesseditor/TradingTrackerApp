import { configureStore } from "@reduxjs/toolkit";
import { appBootstrapSlice } from "../app/slice";

function createStore() {
    const store = configureStore({
        reducer: {
            app: appBootstrapSlice.reducer
        },
    })
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

export type RootState = ReturnType<typeof createStore["getState"]>;
export type AppDispatch = ReturnType<typeof createStore["dispatch"]>;