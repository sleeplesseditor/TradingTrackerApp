import { usePrevious } from "../usePrevious";
import { renderHook } from "@testing-library/react";

describe('usePrevious', () => {
    it('should return undefined on initial render', () => {
        const { result } = renderHook(() => usePrevious('initial'));
        expect(result.current).toBeUndefined();
    });

    it('should return the previous value after an update', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value),
        { initialProps: { value: 'first' } });

        expect(result.current).toBeUndefined();

        rerender({ value: 'second' });
        expect(result.current).toBe('first');
    });

    it('should return the previous value across multiple updates', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value),
        { initialProps: { value: 'first' } });

        expect(result.current).toBeUndefined();

         rerender({ value: 'second' });
        expect(result.current).toBe('first');

        rerender({ value: 'third' });
        expect(result.current).toBe('second');
    });

    it('should handle null and undefined values', () => {
        const { result, rerender } = renderHook(({ value }) => usePrevious(value),
        { initialProps: { value: 'initial' } });

        expect(result.current).toBeUndefined();

        rerender({ value: null });
        expect(result.current).toBe('initial');

        rerender({ value: undefined });
        expect(result.current).toBeNull();
    });
});