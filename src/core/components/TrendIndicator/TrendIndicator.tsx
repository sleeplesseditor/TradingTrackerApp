import * as React from "react";
import './trendIndicator.scss';

export interface Props {
  value: number
}

const TrendIndicator = ({ value }: Props) => {
    const icon = value > 0 ? "arrow_upward" : value < 0 ? "arrow_downward" : "";

    return <i className="material-icons indicator-icon">{icon}</i>
};

export default TrendIndicator;