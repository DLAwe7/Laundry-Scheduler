import { useEffect } from "react";


export function useEscKeyDown(isOpen: boolean, callback: () => void) {

    useEffect(() => {

        if (!isOpen) return;

        function handleEsc(event: KeyboardEvent) {

            if (event.key === "Escape" || event.key === "Esc") {
                callback();
            }

        }

        document.addEventListener("keydown", handleEsc);

        return () => document.removeEventListener("keydown", handleEsc);

    }, [isOpen, callback]);
}
