import * as React from 'react';
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useThrottle } from "../../../../core/hooks/useThrottle";
import "./depthChart.scss";
import "@theme/HighChart";

interface Depth {
    bids: { price: number; depth: number }[]
    asks: { price: number; depth: number }[]
}

export interface Props {
    depth: Depth
}

const DepthChart = ({ depth }: Props) => {
  const throttledDepth = useThrottle<Depth>(depth, 500)

  const [chartOptions, setChartOptions] = React.useState<Highcharts.Options>({
    chart: {
      type: "area",
      animation: false,
      backgroundColor: "#1F2936",
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "bids",
        type: "area",
        data: [],
      },
      {
        name: "asks",
        type: "area",
        data: [],
      },
    ],
    xAxis: {
      labels: {
        autoRotation: [],
        style: {
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
  });

  React.useEffect(() => {
    const { bids, asks } = throttledDepth;

    setChartOptions({
      xAxis: {
        categories: [...bids, ...asks].map((order) => order.price.toString()),
        labels: {
          rotation: -45,
          step: 5,
          formatter: function () {
            return Number.parseFloat(this.value.toString()).toFixed(0)
          },
          style: {
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        },
        title: {
          text: 'Price',
          style: {
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        }
      },
      yAxis: {
        allowDecimals: true,
        labels: {
          rotation: -45,
          step: 1,
          formatter: function () {
            return Number.parseFloat(this.value.toString()).toFixed(0)
          },
          style: {
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        },
        title: {
          text: 'Amount',
          style: {
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        }
      },
      series: [
        {
          name: "bids",
          type: "area",
          data: [...bids.map((bid) => bid.depth), ...asks.map(() => null)],
          color: "#00AD08",
          tooltip: {
            headerFormat: '<b>Bids</b><br/>',
            pointFormat: '<b>Price:</b> {point.x}<br/><b>Amount:</b> {point.y}'
          }
        },
        {
          name: "asks",
          type: "area",
          data: [...bids.map(() => null), ...asks.map((ask) => ask.depth)],
          color: "#FF264D",
          tooltip: {
            headerFormat: '<b>Asks</b><br/>',
            pointFormat: '<b>Price:</b> {point.x}<br/><b>Amount:</b> {point.y}'
          }
        },
      ],
    })
  }, [throttledDepth])

  return (
    <div className="depth-chart__container">
      <HighchartsReact 
        constructorType={"chart"}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  )
};

export default DepthChart;