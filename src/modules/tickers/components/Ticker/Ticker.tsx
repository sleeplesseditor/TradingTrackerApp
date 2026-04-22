import UpdateHighlight from "@core/components/UpdateHighlight/UpdateHighlight";
import { formatCurrencyPair, formatPrice } from "@modules/reference-data/utils";
import TrendIndicator from "@core/components/TrendIndicator/TrendIndicator";
import './ticker.scss';

export interface Props {
    currencyPair: string
    dailyChange: number
    dailyChangeRelative: number
    isActive: boolean
    lastPrice: number
    onClick: () => void
}

const Ticker = ({
    currencyPair,
    dailyChange,
    dailyChangeRelative,
    isActive,
    lastPrice,
    onClick,
}: Props) => {
    const isPositiveChange = dailyChange > 0;
    const percentChange = dailyChangeRelative ? dailyChangeRelative * 100 : undefined;

    return (
        <div 
            className={`ticker-container${isActive ? '__active' : ''}`}
            data-testid="ticker-container"
            onClick={onClick}
            role="button"
        >
            <div className="currency-pair">{formatCurrencyPair(currencyPair)}</div>
            <div className="price">
                {formatPrice(lastPrice)}
            </div>
            <div 
                className={`relative-change${isPositiveChange ? '__positive' : '__negative'}`}
                data-testid="relative-change"
            >
                <TrendIndicator value={dailyChangeRelative} />
                <UpdateHighlight value={percentChange?.toFixed(2)} />
                {percentChange && "%"}
            </div>
            <div 
                className={`change${isPositiveChange ? '__positive' : '__negative'}`} 
                data-testid="change"
            >
                <UpdateHighlight value={dailyChange?.toFixed(2)} />
            </div>
        </div>
    )
}

export default Ticker;