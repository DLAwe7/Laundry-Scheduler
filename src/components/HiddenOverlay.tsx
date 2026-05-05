import "./HiddenOverlay.css";
import { createPortal } from "react-dom"

type OverlayType = "sidebar" | "dropdown" | "modal";

type OverlayProps = {
    onClose: () => void;
    type?: OverlayType;
}

function HiddenOverlay({ onClose, type }: OverlayProps) {

    return (



        createPortal(
            <div className={`overlay ${type ? type : ""}`} aria-hidden="true" onClick={onClose}></div >, document.body
        )



    )



}

export default HiddenOverlay;

