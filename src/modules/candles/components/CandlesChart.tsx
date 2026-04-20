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
        credits: {
            enabled: false
        },
        yAxis: [
            {
                labels: {
                    enabled: false
                },
                title: {
                    text: "OHLC",
                    x: 10
                },
                height: "70%",
                lineWidth: 1,
                resize: {
                    enabled: true,
                },
            },
            {
                labels: {
                    enabled: false
                },
                title: {
                    text: "Volume",
                    x: 10
                },
                top: "75%",
                height: "25%",
                offset: 0,
                lineWidth: 1,
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
                        name: formatCurrencyPair(currencyPair),
                        type: "candlestick",
                        data: ohlc,
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
                // tooltip: {
                //     headerFormat: `<span style="font-size: 12px; color: #ffffff;">${formatCurrencyPair(currencyPair)}</span><br/>`,
                //     pointFormat: `<span style="font-size: 12px; color: #ffffff;">
                //         <b>Open:</b> {point.open:.2f}<br/>
                //         <b>High:</b> {point.high:.2f}<br/>
                //         <b>Low:</b> {point.low:.2f}<br/>
                //         <b>Close:</b> {point.close:.2f}<br/>
                //     </span>`
                // }
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