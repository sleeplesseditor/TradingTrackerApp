import { usePerformanceMonitor } from "@core/hooks/usePerformanceMonitor";
import "./performanceDashboard.scss";

const PerformanceDashboard = () => {
  const { fps, memory, connectionHealth, dataLatencies } = usePerformanceMonitor();

  return (
    <div
      className="performance-dashboard"
    >
      <span>FPS: {fps}</span>
      <span>Memory: {memory.toFixed(1)}MB</span>
      <span>Connection: {connectionHealth}</span>

      {/* Separate latency for each data type */}
      <div className="performance-dashboard__latencies">
        <span className="performance-dashboard__latency-label">Data Processing Latency:</span>
        <span>Trades: {dataLatencies.trades.toFixed(1)}ms</span>
        <span>Tickers: {dataLatencies.tickers.toFixed(1)}ms</span>
        <span>OrderBook: {dataLatencies.orderBook.toFixed(1)}ms</span>
        <span>Candles: {dataLatencies.candles.toFixed(1)}ms</span>
      </div>

      {/* Highlight slow handlers */}
      {Object.entries(dataLatencies).map(
        ([type, latency]) =>
          latency > 20 && (
            <div 
              className="performance-dashboard__slow-handler" 
              key={type}
            >
              ⚠️ {type} slow: {latency.toFixed(1)}ms
            </div>
          )
      )}
    </div>
  )
}

export default PerformanceDashboard;