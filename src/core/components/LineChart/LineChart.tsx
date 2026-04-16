import * as React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Props {
    height?: number
    values: number[]
    width?: number
}

const LineChart = ({ values, width = 50, height = 25 }: Props) => {
    const chartOptions = React.useMemo(() => ({
        chart: {
            type: "line",
            width,
            height,
            backgroundColor: "transparent",
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0],
        },
        title: { text: "" },
        xAxis: {
            visible: false,
            lineWidth: 0,
            tickLength: 0,
        },
        yAxis: {
            visible: false,
            gridLineWidth: 0,
        },
        legend: { enabled: false },
        tooltip: { enabled: false },
        credits: { enabled: false },
        accessibility: { enabled: false },
        plotOptions: {
            line: {
                marker: { enabled: false },
                lineWidth: 1,
                color: "rgba(245, 245, 245, 0.64",
                enableMouseTracking: false,
            },
        },
        series: [
            {
                data: values,
                animation: false,
            },
        ],
    }), [values, width, height]);

    if (values.length === 0) {
        return <div></div>
    }

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
};

export default LineChart;