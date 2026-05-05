import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/dateHelpers";
import type { CreateReservationInput } from "./TimeStampsList";
import type { UseMutationResult } from "@tanstack/react-query";


type ConfirmationModalProps = {
    selectedSlot: {
        startTime: Date;
        endTime: Date;
    };
    createReservation: UseMutationResult<
        void,
        Error,
        CreateReservationInput,
        unknown
    >;
    setSelectedSlot: React.Dispatch<React.SetStateAction<CreateReservationInput | null>>;
};



function ConfirmationModal({ selectedSlot, setSelectedSlot, createReservation, }: ConfirmationModalProps) {

    const hasMaxReservationsError = createReservation.error?.message.includes("User can only have 2 active reservations");
    const navigate = useNavigate();


    return (
        <div className="confirmation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title">

            {!createReservation.isError &&

                (<p>
                    Voulez-vous réserver de {formatTime(selectedSlot.startTime)} à {formatTime(selectedSlot.endTime)} ?
                </p>)}

            <div className="confirmation-buttons-wrapper">
                {hasMaxReservationsError ? (
                    <>

                        <button
                            className="confirmation-button create"
                            type="button"
                            onClick={() => {
                                createReservation.reset();
                                setSelectedSlot(null);
                                navigate("/app/reservations");
                            }}
                        >
                            <span>Voir mes réservations</span>

                        </button>

                        <button
                            className="confirmation-button"
                            type="button"
                            onClick={() => {
                                createReservation.reset();
                                setSelectedSlot(null);
                            }}
                        >
                            <span>Retour</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="confirmation-button create"
                            type="button"
                            onClick={() => {
                                createReservation.mutate({
                                    startTime: selectedSlot.startTime,
                                    endTime: selectedSlot.endTime,
                                });
                            }}
                            disabled={createReservation.isPending}
                        >
                            <span>{createReservation.isPending ? "Réservation en cours..." : "Oui"}</span>
                        </button>

                        <button
                            className="confirmation-button"
                            type="button"
                            onClick={() => {
                                createReservation.reset();
                                setSelectedSlot(null);
                            }}
                            disabled={createReservation.isPending}
                        >
                            <span>Non</span>
                        </button>
                    </>
                )}
            </div>

        </div >
    );
}

export default ConfirmationModal;