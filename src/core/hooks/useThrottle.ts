import * as React from 'react';
import { throttle } from "lodash";

export const useThrottleFn = <T extends (...args: any) => any>(fn: T, ms = 1000) => {
    const throttledFn = React.useMemo(() => {
        return throttle(fn, ms)
    }, [fn, ms]);

    // fn may call setState.
    React.useEffect(() => {
        return () => {
            throttledFn.cancel()
        }
    }, [throttledFn]);

    return throttledFn;
};

export const useThrottle = <T>(value: T, ms = 1000) => {
    const [throttledValue, setThrottledValue] = React.useState(value);
    const setThrottledValueThrottled = useThrottleFn(setThrottledValue, ms);

    React.useEffect(() => {
       value && setThrottledValueThrottled(value)
    }, [value, setThrottledValueThrottled]);

    return throttledValue;
}