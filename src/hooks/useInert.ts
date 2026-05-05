import { useEffect, type RefObject } from "react";



export function useInert(ref: RefObject<HTMLElement | null>, inert: boolean) {
    useEffect(() => {
        if (!ref.current) return;

        if (inert) {

            const focused = document.activeElement;

            if (focused instanceof HTMLElement && ref.current.contains(focused)) {
                focused.blur();
            }

            ref.current.setAttribute("inert", "");
        } else {
            ref.current.removeAttribute("inert");
        }
    }, [ref, inert]);
}