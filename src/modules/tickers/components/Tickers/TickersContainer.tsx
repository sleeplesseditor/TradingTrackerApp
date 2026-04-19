import { useSelector } from "react-redux";
import { getVisibleCurrencyPairTickers } from "@modules/tickers/selectors";
import { getSelectedCurrencyPair } from "@modules/selection/selector";
import Tickers from "./Tickers";

const TickersContainer = () => {
    const { currencyPairs } = useSelector(getVisibleCurrencyPairTickers);
    const selectedCurrencyPair = useSelector(getSelectedCurrencyPair);

    return (
        <Tickers 
            currencyPairs={currencyPairs} 
            selectedCurrencyPair={selectedCurrencyPair}
        />
    )
}

export default TickersContainer;