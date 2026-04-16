import * as React from "react";
import './trendIndicator.scss';

const SHOW_ICON_FOR_X_MS = 5000

export interface Props {
  value: number
}

const TrendIndicator = ({ value }: Props) => {
    const [isHidden, setIsHidden] = React.useState<boolean>(true);

    React.useEffect(() => {
        setIsHidden(false);

        const timeoutId = setTimeout(() => setIsHidden(true), SHOW_ICON_FOR_X_MS);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [value])

    const icon = isHidden ? "" : value > 0 ? "arrow_upward" : value < 0 ? "arrow_downward" : "";

    return <i className="material-icons indicator-icon">{icon}</i>
};

export default TrendIndicator;