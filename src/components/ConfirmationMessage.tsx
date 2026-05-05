import { createPortal } from "react-dom";
import "./ConfirmationMessage.css"
import { useEffect } from "react";

type ConfirmationMessageProps = {
    message: string;
    onClose: () => void;
    duration?: number;
};

function ConfirmationMessage({ message, onClose, duration = 2000, }: ConfirmationMessageProps) {

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [duration, onClose]);

    return (

        createPortal(

            <div className="confirmation-message-wrapper" role="status" aria-live="polite">

                <p>{message}</p>

            </div>, document.body

        )



    )

}

export default ConfirmationMessage;