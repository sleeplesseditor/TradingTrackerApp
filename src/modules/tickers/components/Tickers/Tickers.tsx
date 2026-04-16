import * as React from 'react';
import { usePrevious } from "@core/hooks/usePrevious";
import TickerContainer from "../Ticker/TickerContainer";
import styles from "./tickers.module.scss";

export type ScrollDirection = "left" | "right";

export interface Props {
    currencyPairs: string[]
    selectedCurrencyPairIndex?: number
}

/**
 * Calculates the scale factor for an item based on its position.
 * Items near the center are larger, items near edges are smaller.
 */
const calculateScaleFactor = (index: number, itemCount: number): number => {
    const indexThreshold = Math.floor(itemCount / 2);
    const val = index <= indexThreshold ? index : indexThreshold - Math.abs(indexThreshold - index);
    return 1 - (indexThreshold - val) / 10;
};

const Tickers = ({ currencyPairs, selectedCurrencyPairIndex }: Props) => {
    const [direction, setDirection] = React.useState<ScrollDirection>("left");
    const previousSelectedCurrencyPairIndex = usePrevious(selectedCurrencyPairIndex);

    React.useEffect(() => {
        const direction = Number(previousSelectedCurrencyPairIndex || 0) > Number(selectedCurrencyPairIndex || 0)
            ? "right"
            : "left"
        setDirection(direction);
    }, [selectedCurrencyPairIndex])

    return (
        <div className={styles.tickers__container}>
            {currencyPairs.map((currencyPair, index) => {
                const scaleFactor = calculateScaleFactor(index, currencyPairs.length);
                const translateX = direction === "left" ? 100 : -100;

                return (
                    <div
                        key={currencyPair}
                        className={styles.tickers__wrapper}
                        style={{
                            animation: `slide-in-${index} 0.5s forwards`,
                            transform: `scale(${scaleFactor}) translateX(${translateX}%)`,
                        } as React.CSSProperties}
                    >
                        <TickerContainer currencyPair={currencyPair} />
                    </div>
                );
            })}
        </div>
    )
}

export default Tickers;