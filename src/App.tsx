import * as React from 'react';
import { Provider, useDispatch } from 'react-redux';
import getStore,{ type AppDispatch } from "@modules/redux/store";
import { bootstrapApp } from '@modules/app/slice';
import { usePopover } from '@core/hooks/usePopover';
import '@styles/panelElements.scss';

import CandlesChartContainer from '@modules/candles/components/CandlesChartContainer';
import TradesContainer from '@modules/trades/components/TradesContainer';
import DepthChartContainer from '@modules/book/components/DepthChart/DepthChartContainer';
import BookContainer from '@modules/book/components/Book/BookContainer';
import MarketContainer from '@modules/tickers/components/Market/MarketContainer';
import TickersContainer from '@modules/tickers/components/Tickers/TickersContainer';
import PerformanceDashboard from '@modules/perfomanceDashboard/performanceDashboard';

const store = getStore();

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, toggle, triggerRef, popoverRef, popoverStyle } = usePopover<HTMLButtonElement>({
    placement: 'bottom-end',
    offset: 8,
  });

  React.useEffect(() => {
    dispatch(bootstrapApp())
  }, []);

  return (
    <div className="trading-tracker__container">
      <div className="trading-tracker__content">
        <div className="trading-tracker__header">
          <span>Bitfinex Trading Tracker</span>
          {import.meta.env.DEV && (
            <React.Fragment>
              <button
                aria-controls="performancePopover"
                aria-expanded={isOpen}
                className="settings-icon"
                onClick={toggle}
                ref={triggerRef}
                type="button"
              >
                <i className="material-icons">settings</i>
              </button>
              <div
                aria-hidden={!isOpen}
                className={`popover ${isOpen ? 'popover--open' : ''}`}
                id="performancePopover"
                ref={popoverRef}
                style={popoverStyle}
              >
                <PerformanceDashboard />
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="trading-tracker__tickers-panel">
          <TickersContainer />
        </div>
        <div className="trading-tracker__market-panel">
          <h4 className="panel-header">Market</h4>
          <MarketContainer />
        </div>
        <div className="trading-tracker__trades-panel">
          <h4 className="panel-header">Trades</h4>
          <TradesContainer />
        </div>
        <div className="trading-tracker__candles-panel">
          <CandlesChartContainer />
        </div>
        <div className="trading-tracker__book-panel">
          <h4 className="panel-header">Book</h4>
          <BookContainer />
        </div>
        <div className="trading-tracker__depth-panel">
          <h4 className="panel-header">Depth</h4>
          <DepthChartContainer />
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