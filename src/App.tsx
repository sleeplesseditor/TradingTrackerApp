import * as React from 'react';
import { Provider, useDispatch } from 'react-redux';
import getStore,{ type AppDispatch } from "@modules/redux/store";
import { bootstrapApp } from '@modules/app/slice';
import './styles/panelElements.scss';

import CandlesChartContainer from '@modules/candles/components/CandlesChartContainer';
import TradesContainer from '@modules/trades/components/TradesContainer';
import DepthChartContainer from '@modules/book/components/DepthChart/DepthChartContainer';
import BookContainer from '@modules/book/components/Book/BookContainer';
import MarketContainer from '@modules/tickers/components/Market/MarketContainer';

const store = getStore();

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatch(bootstrapApp())
  }, []);

  return (
    <div className="trading-tracker__container">
      <div className="trading-tracker__content">
        <div className="trading-tracker__header">Trading Tracker</div>
        <div className="trading-tracker__tickers-panel">tickers</div>
        <div className="trading-tracker__market-panel">
          <MarketContainer />
        </div>
        <div className="trading-tracker__trades-panel">
          <TradesContainer />
        </div>
        <div className="trading-tracker__candles-panel">
          <CandlesChartContainer />
        </div>
        <div className="trading-tracker__book-panel">
          <BookContainer />
        </div>
        <div className="trading-tracker__depth-panel">
          <DepthChartContainer />
        </div>
        <div className="trading-tracker__footer">
          <span>Latency</span>
          <span>Diagnostic</span>
        </div>
      </div>
    </div>
  )
} 

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App