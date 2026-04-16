import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "@modules/redux/store";
import { getTicker } from "@modules/tickers/selectors";
import { selectCurrencyPair } from "@modules/selection/slice";
import { getSelectedCurrencyPair } from "@modules/selection/selector";
import Ticker from "./Ticker";

export interface ContainerProps {
    currencyPair: string
}

const TickerContainer = ({ currencyPair }: ContainerProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const ticker = useSelector(getTicker)(currencyPair);
    const { lastPrice, dailyChange, dailyChangeRelative } = ticker || {};

    const selectedCurrencyPair = useSelector(getSelectedCurrencyPair);

    return (
        <Ticker
            currencyPair={currencyPair}
            dailyChange={dailyChange!}
            dailyChangeRelative={dailyChangeRelative!}
            isActive={selectedCurrencyPair === currencyPair}
            lastPrice={lastPrice!}
            onClick={() => dispatch(selectCurrencyPair({ currencyPair }))}
        />
    )
}

export default TickerContainer;