import { usePopover } from '@core/hooks/usePopover';
import { renderHook, act } from '@testing-library/react';

describe('usePopover', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePopover());
        expect(result.current.isOpen).toBe(false);
        expect(result.current.popoverStyle.visibility).toBe('hidden');
    });

    it('should open the popover when toggle is called', () => {
        const { result } = renderHook(() => usePopover());
        act(() => {
            result.current.toggle();
        });

        expect(result.current.isOpen).toBe(true);
    });

    it('should close the popover when toggle is called again', () => {
        const { result } = renderHook(() => usePopover({ defaultOpen: true }));
        act(() => {
            result.current.toggle();
        });
        expect(result.current.isOpen).toBe(false);
        expect(result.current.popoverStyle.visibility).toBe('hidden');
    });

    it('should open the popover when open is called', async () => {
        const { result } = renderHook(() => usePopover());
        act(() => {
            result.current.open();
        });
        expect(result.current.isOpen).toBe(true);
    });

    it('should close the popover when close is called', () => {
        const { result } = renderHook(() => usePopover({ defaultOpen: true }));
        act(() => {
            result.current.close();
        });
        expect(result.current.isOpen).toBe(false);
        expect(result.current.popoverStyle.visibility).toBe('hidden');
    });
});