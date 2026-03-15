import type { ChannelTypes } from "./Channels"

export type SubscribeMsg = {
    channel: ChannelTypes
    event: string
    key?: string
    prec?: string
    symbol?: string
}