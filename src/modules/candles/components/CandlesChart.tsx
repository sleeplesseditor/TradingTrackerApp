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
                // name: formatCurrencyPair(currencyPair),
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

            setChartOptions({
                series: [
                    {
                        type: "candlestick",
                        name: formatCurrencyPair(currencyPair),
                        data: ohlc,
                    },
                    {
                        type: "column",
                        data: volumes,
                    },
                ],
                plotOptions: {
                    candlestick: {
                        color: "#FF264D",
                        upColor: "#00AD08",
                    },
                    column: {
                        color: "#4682b4",
                        borderRadius: 0,
                        borderWidth: 0,
                    },
                },
            })
        }
    }, [candles, currencyPair]);

    console.log('CHART OPTIONS', chartOptions)

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