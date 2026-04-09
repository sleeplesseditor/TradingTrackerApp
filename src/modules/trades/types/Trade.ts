export interface Trade {
    amount: number
    id: number
    price: number
    timestamp: number
}

export type RawTrade = [number, number, number, number];