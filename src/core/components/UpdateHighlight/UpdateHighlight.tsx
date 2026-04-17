import * as React from 'react';
import { usePrevious } from "@core/hooks/usePrevious";
import './updateHighlight.scss';

export interface Props {
    effect?: "zoom" | "default"
    value?: string | null
}

export const calculateParts = (value: string, prevValue: string) => {
    if (!value || !prevValue) {
        return [value, ""]
    }

    const length = Math.min(value.length, prevValue.length);
    let index = 0;
    for (let i = 0; i < length; i++) {
        if (value[i] === prevValue[i]) {
            index++
        } else {
            break
        }
    }
    // [0] = common prefix
    // [1] = - the remainder of value after the prefix
    return [value.slice(0, index), value.slice(index, value.length)]
}

interface AnimatedValueOptions {
    delay?: number
    duration?: number
    scale?: number
    value?: string
}

const AnimatedValue = ({ value, delay = 0, scale = 1, duration = 200 }: AnimatedValueOptions) => {
    const ref = React.createRef<HTMLDivElement>()

    React.useEffect(() => {
        let animation: Animation | undefined = undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

        if (typeof ref.current?.animate === "function") {
            const runAnimation = () => {
                animation = ref.current?.animate(
                    [
                        // keyframes
                        { color: "#FFA41B", transform: "scale(1)" },
                        ...(scale === 1 ? [] : [{ color: "#FFFFFF", transform: `scale(${scale})` }]),
                        { color: "#FFFFFF", transform: "scale(1)" },
                    ],
                    {
                        duration,
                        iterations: 1,
                    }
                )
            }

            if (delay) {
                timeoutId = setTimeout(() => requestAnimationFrame(runAnimation), delay)
            } else {
                requestAnimationFrame(runAnimation)
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            if (animation) {
                animation.cancel()
            }
        }
    }, [value]);

    return <span className="update-highlight__container" ref={ref}>{value}</span>
    }

    const UpdateHighlight = ({ value, effect = "default" }: Props) => {
    const changedPartRef = React.createRef<HTMLDivElement>();
    const prev = usePrevious(value);
    const [[identicalPart, changedPart], setParts] = React.useState<string[]>([]);

    React.useEffect(() => {
        setParts(calculateParts(value || "", (prev as string) || ""))
    }, [value])

    const digits = effect === "zoom" ? (
        changedPart?.split("").map((digit, index) => (
            <AnimatedValue key={index} value={digit} delay={index * 100} scale={2} duration={300} />
        ))
    ) : (
        <AnimatedValue value={changedPart} />
    )
    return (
        <div className="update-highlight__content">
            <div className="update-highlight__identical-part">{identicalPart}</div>
            <div ref={changedPartRef}>{digits}</div>
        </div>
    )
}

export default UpdateHighlight;