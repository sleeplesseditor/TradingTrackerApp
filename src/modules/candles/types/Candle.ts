export interface Candle {
    close: number
    high: number
    low: number
    open: number
    timestamp: number
    volume: number
}

export type CandleTuple = [number, number, number, number, number, number];