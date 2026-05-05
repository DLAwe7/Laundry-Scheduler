import { useEffect, useRef, type RefObject } from "react";





function useRestoreFocus(active: boolean, refToRestore: RefObject<HTMLElement | null>) {
    const lastFocusedRef = useRef<HTMLElement | null>(null);
    const wasActiveRef = useRef(false);

    useEffect(() => {

        if (active) {
            const current = document.activeElement;
            lastFocusedRef.current = current instanceof HTMLElement ? current : null;
        }

        if (!active && wasActiveRef.current) {
            const target = refToRestore?.current || lastFocusedRef.current;

            if (target) {
                requestAnimationFrame(() => {
                    target.focus({ preventScroll: true });
                });
            }
        }

        wasActiveRef.current = active;
    }, [active, refToRestore]);
}

export default useRestoreFocus;