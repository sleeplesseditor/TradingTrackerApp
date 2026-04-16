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
          fontFamily: "FiraSans-MediumItalic",
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
    const { bids, asks } = throttledDepth

    setChartOptions({
      xAxis: {
        categories: [...bids, ...asks].map((order) => order.price.toString()),
        labels: {
          step: 5,
          formatter: function () {
            return Number.parseFloat(this.value.toString()).toFixed(0)
          },
        },
      },
      series: [
        {
          name: "bids",
          type: "area",
          data: [...bids.map((bid) => bid.depth), ...asks.map(() => null)],
          color: "#00AD08",
          tooltip: {
            pointFormatter: function() {
              return `<strong>${this.series.name.charAt(0).toUpperCase() + this.series.name.slice(1)}</strong><br/>Price: ${this.x}<br/>Depth: ${this.y}`
            }
          }
        },
        {
          name: "asks",
          type: "area",
          data: [...bids.map(() => null), ...asks.map((ask) => ask.depth)],
          color: "#FF264D",
        },
      ],
    })
  }, [throttledDepth])

  return (
    <div className="depth-chart__container">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} constructorType={"chart"} />
    </div>
  )
};

export default DepthChart;