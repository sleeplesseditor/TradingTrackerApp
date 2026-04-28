import * as React from 'react';

export type PopoverPlacement =
    | 'bottom-start'
    | 'bottom-end'
    | 'top-start'
    | 'top-end';

export interface UsePopoverOptions {
    defaultOpen?: boolean;
    offset?: number;
    placement?: PopoverPlacement;
}

export const usePopover = <T extends HTMLElement = HTMLElement>({
        defaultOpen = false,
        placement = 'bottom-start',
        offset = 8,
    }: UsePopoverOptions = {}) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const triggerRef = React.useRef<T | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const [popoverStyle, setPopoverStyle] = React.useState<React.CSSProperties>({
        position: 'fixed',
        top: 0,
        left: 0,
        visibility: 'hidden',
        zIndex: 9999,
    });

    const updatePosition = React.useCallback(() => {
        const trigger = triggerRef.current;
        const popover = popoverRef.current;
        if (!trigger || !popover) {
            return;
        }

        const triggerRect = trigger.getBoundingClientRect();
        const popoverRect = popover.getBoundingClientRect();

        let top = triggerRect.bottom + offset;
        let left = triggerRect.left;

        if (placement.startsWith('top')) {
            top = triggerRect.top - popoverRect.height - offset;
        }

        if (placement.endsWith('end')) {
            left = triggerRect.right - popoverRect.width;
        }

        setPopoverStyle((current) => ({
            ...current,
            top,
            left,
            visibility: isOpen ? 'visible' : 'hidden',
        }));
    }, [isOpen, offset, placement]);

    React.useEffect(() => {
        if (!isOpen) {
            setPopoverStyle((current) => ({
                ...current,
                visibility: 'hidden',
            }));
            return;
        }

        updatePosition();

        const handleScrollOrResize = () => updatePosition();

        window.addEventListener('resize', handleScrollOrResize);
        window.addEventListener('scroll', handleScrollOrResize, true);

        return () => {
            window.removeEventListener('resize', handleScrollOrResize);
            window.removeEventListener('scroll', handleScrollOrResize, true);
        };
    }, [isOpen, updatePosition]);

    React.useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            const popover = popoverRef.current;
            const trigger = triggerRef.current;

            if (!popover || !trigger) {
                return;
            }

            if (
                popover.contains(event.target as Node) ||
                trigger.contains(event.target as Node)
            ) {
                return;
            }

            setIsOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
            setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((value) => !value);

    return {
        isOpen,
        open,
        close,
        toggle,
        triggerRef,
        popoverRef,
        popoverStyle,
    };
};
