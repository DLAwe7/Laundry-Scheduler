import { useEffect, type RefObject } from "react";




function useAutoFocusOnOpen(isOpen: boolean, containerRef: RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (!isOpen) return;
        const el = containerRef.current;
        if (!el) return;

        const firstFocusable = el.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        firstFocusable?.focus({ preventScroll: true });
    }, [isOpen, containerRef]);
}

export default useAutoFocusOnOpen;