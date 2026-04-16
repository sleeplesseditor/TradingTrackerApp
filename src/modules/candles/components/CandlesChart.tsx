import * as React from 'react';
import type { Candle } from '@modules/candles/types/Candle';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { formatCurrencyPair } from "@modules/reference-data/utils";
import "@theme/HighChart";
import './candlesChart.scss';

export interface Props {
    candles: Candle[];
    currencyPair: any;
    isStale?: boolean;
}

const CandlesChart = ({ candles, currencyPair, isStale }: Props) => {
    const [chartOptions, setChartOptions] = React.useState<Highcharts.Options>({
        time: {
            useUTC: false,
        },
        // tooltip: {
        //     enabled: true,
        //     shared: false,
        //     useHTML: true,
        //     formatter: function() {
        //         if (this.series.type === 'candlestick') {
        //             const point = this.point as any;
        //             return `
        //                 <div style="font-size: 12px; color: #ffffff;">
        //                     <div><b>${this.series.name}</b></div>
        //                     <div>Open: ${point.open?.toFixed(2)}</div>
        //                     <div>High: ${point.high?.toFixed(2)}</div>
        //                     <div>Low: ${point.low?.toFixed(2)}</div>
        //                     <div>Close: ${point.close?.toFixed(2)}</div>
        //                     <div>${Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)}</div>
        //                 </div>
        //             `;
        //         }
        //         return false;
        //     }
        // },
        credits: {
            enabled: false
        },
        yAxis: [
            {
                labels: {
                    align: "right",
                    x: -3,
                },
                title: {
                    text: "OHLC",
                },
                height: "70%",
                lineWidth: 2,
                resize: {
                    enabled: true,
                },
            },
            {
                labels: {
                    align: "right",
                    x: -3,
                },
                title: {
                    text: "Volume",
                },
                top: "75%",
                height: "25%",
                offset: 0,
                lineWidth: 2,
            },
        ],
        series: [
            {
                type: "candlestick",
                data: [],
            },
            {
                type: "column",
                name: "Volume",
                data: [],
                yAxis: 1,
            },
        ],
    } as Highcharts.Options);

    React.useEffect(() => {
        if (candles && candles.length > 0) {
            const ohlc = candles.map(({ timestamp, open, high, low, close }) => [
                timestamp,
                open,
                high,
                low,
                close,
            ]);

            const volumes = candles
                .map(({ timestamp, volume }) => [timestamp, volume])
                .sort((a, b) => a[0]! - b[0]!);

            setChartOptions(prevOptions => ({
                ...prevOptions,
                series: [
                    {
                        name: "BTC/USD",
                        type: "candlestick",
                        data: ohlc,
                        // tooltip: {
                        //     format: function() {
                        //         console.log('This', this)
                        //         return `
                        //             <span style="font-size: 12px; color: #ffffff;">
                        //                 <b>${this.series.name}</b><br/>
                        //                 <b>Open:</b> ${this.options.open?.toFixed(2)}<br/>
                        //                 <b>High:</b> ${this.options.high?.toFixed(2)}<br/>
                        //                 <b>Low:</b> ${this.options.low?.toFixed(2)}<br/>
                        //                 <b>Close:</b> ${this.options.close?.toFixed(2)}<br/>
                        //             </span>
                        //         `;
                        //     }
                        // }
                    },
                    {
                        type: "column",
                        name: "Volume",
                        data: volumes,
                    },
                ],
                plotOptions: {
                    candlestick: {
                        color: "pink",
                        lineColor: 'red',
                        upColor: "lightgreen",
                        upLineColor: 'green',
                    },
                    column: {
                        color: "#4682b4",
                        borderRadius: 0,
                        borderWidth: 0,
                    },
                },
                tooltip: {
                    // formatter: function() {
                    //     console.log('THIS', this)
                    //     return ``;
                    // }
                    headerFormat: `<span style="font-size: 12px; color: #ffffff;">${formatCurrencyPair(currencyPair)}</span><br/>`,
                    pointFormat: `<span style="font-size: 12px; color: #ffffff;">
                        <b>Open:</b> {point.open:.2f}<br/>
                        <b>High:</b> {point.high:.2f}<br/>
                        <b>Low:</b> {point.low:.2f}<br/>
                        <b>Close:</b> {point.close:.2f}<br/>
                    </span>`
                }
            }))
        }
    }, [candles, currencyPair]);

    return (
        <div className="trade-tracker__container candles-chart">
            <HighchartsReact 
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={"stockChart"}
            />
        </div>
    )
};

export default CandlesChart;