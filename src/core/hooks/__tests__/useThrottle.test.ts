import { useThrottle } from "../useThrottle";
import { renderHook } from "@testing-library/react";

describe("useThrottle", () => {
    it("should return the initial value immediately", () => {
        const { result } = renderHook(() => useThrottle("initial", 1000));
        expect(result.current).toBe("initial");
    });

    it("should update the value after the specified delay", async () => {
        const { result, rerender } = renderHook(({ value, delay }) => useThrottle(value, delay), {
            initialProps: { value: "initial", delay: 100 },
        });

        expect(result.current).toBe("initial");

        rerender({ value: "updated", delay: 100 });
        expect(result.current).toBe("initial");

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(result.current).toBe("updated");
    });

    it("should not update the value if the component is unmounted before the delay", async () => {
        const { result, rerender, unmount } = renderHook(({ value, delay }) => useThrottle(value, delay), {
            initialProps: { value: "initial", delay: 100 },
        });

        expect(result.current).toBe("initial");

        rerender({ value: "updated", delay: 100 });
        unmount();

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(result.current).toBe("initial");
    });
});