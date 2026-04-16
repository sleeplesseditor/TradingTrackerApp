import LineChart from "@core/components/LineChart/LineChart";

interface Props {
    value: number[]
}

const PriceChart = ({ value: prices }: Props) => {
    return (
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 5, paddingRight: 5 }}>
            <LineChart values={prices} />
        </div>
    )
};

export default PriceChart;