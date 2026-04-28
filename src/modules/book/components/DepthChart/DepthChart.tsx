import * as React from 'react';
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useThrottle } from "@core/hooks/useThrottle";
import { priceFormatter } from "@modules/ag-grid/formatter";
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
            const price = priceFormatter({ value: Number(this.value) });
            return price.toString().substring(0, price.toString().indexOf("."));
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
          enabled: true,
          step: 1,
          formatter: function () {
            return Number.parseFloat(this.value.toString()).toFixed(0)
          },
          style: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        },
        title: {
          text: 'Amount',
          style: {
            color: "#FFFFFF",
            fontWeight: "700",
            fontFamily: "sans-serif",
          },
        }
      },
      tooltip: {
        shared: false,
        useHTML: true,
        backgroundColor: '#ffffff',
        borderColor: '#333',
        borderRadius: 5,
        style: {
          color: '#000',
          fontSize: '12px'
        },
        formatter: function() {
          const seriesName = this.series.name.charAt(0).toUpperCase() + this.series.name.slice(1);
          return `<div style="background:#ffffff;color:#000;padding:8px 10px;border-radius:6px;border:1px solid #333;display:inline-block;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${this.series.color};margin-right:5px;"></span>
            <b>${seriesName}</b><br/><b>Price:</b> ${String(this.category).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br/><b>Depth:</b> ${this.y}
          </div>`;
        }
      },
      series: [
        {
          name: "bids",
          type: "area",
          data: [...bids.map((bid) => bid.depth), ...asks.map(() => null)],
          color: "#00AD08"
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
      <HighchartsReact 
        constructorType={"chart"}
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  )
};

export default DepthChart;