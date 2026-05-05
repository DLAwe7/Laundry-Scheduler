import { useEffect, type RefObject } from "react";




function useArrowNavigation(enabled: boolean, containerRef: RefObject<HTMLElement | null>, loop = true) {
    useEffect(() => {
        if (!enabled) return;
        const el = containerRef.current;
        if (!el) return;

        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ];
        const focusableEls = Array.from(el.querySelectorAll<HTMLElement>(focusableSelectors.join(',')));

        if (!focusableEls.length) return;

        const handleKeyDown = (e: KeyboardEvent) => {

            const activeElement = document.activeElement;
            if (!(activeElement instanceof HTMLElement)) return;

            const index = focusableEls.indexOf(activeElement);
            if (index === -1) return;

            let nextIndex;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    nextIndex = index + 1;
                    if (nextIndex >= focusableEls.length) nextIndex = loop ? 0 : focusableEls.length - 1;
                    focusableEls[nextIndex].focus();
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    nextIndex = index - 1;
                    if (nextIndex < 0) nextIndex = loop ? focusableEls.length - 1 : 0;
                    focusableEls[nextIndex].focus();
                    break;

                case "Home":
                    e.preventDefault();
                    focusableEls[0].focus();
                    break;

                case "End":
                    e.preventDefault();
                    focusableEls[focusableEls.length - 1].focus();
                    break;

                default:
                    break;
            }
        };

        el.addEventListener("keydown", handleKeyDown);
        return () => el.removeEventListener("keydown", handleKeyDown);
    }, [enabled, containerRef, loop]);


}

export default useArrowNavigation;