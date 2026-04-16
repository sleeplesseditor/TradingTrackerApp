import * as React from 'react';

export const usePrevious = (val: any) => {
    const ref = React.useRef({})

    React.useEffect(() => {
        ref.current = val
    }, [val])

    return ref.current;
}