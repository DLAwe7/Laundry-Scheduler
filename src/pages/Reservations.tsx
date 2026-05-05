import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";
import "./Reservations.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import HiddenOverlay from "../components/HiddenOverlay";
import ConfirmationMessage from "../components/ConfirmationMessage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useEscKeyDown } from "../hooks/useEscKeyDown";

type Reservation = {
    id: string;
    starts_at: string;
    ends_at: string;
};



function Reservations() {

    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);


    const { session } = useApp();
    const userId = session?.user.id;

    const { data: reservations = [], isLoading, error } = useQuery<Reservation[]>({
        queryKey: ["my-reservations", userId],
        enabled: !!userId,
        queryFn: async () => {
            if (!userId) {
                throw new Error("Not authenticated");
            }

            const { data, error } = await supabase
                .from("reservations")
                .select("id, starts_at, ends_at")
                .eq("user_id", userId)
                .gt("ends_at", new Date().toISOString())
                .order("starts_at", { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        },
    });

    const queryClient = useQueryClient();

    const deleteReservation = useMutation({
        mutationFn: async (reservationId: string) => {
            const { error } = await supabase
                .from("reservations")
                .delete()
                .eq("id", reservationId);

            if (error) {
                throw error;
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-reservations", userId] });
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            setSelectedReservation(null);
            setConfirmationMessage("Votre réservation a été supprimée");

        },

        onError: (error: Error) => {
            setConfirmationMessage(
                error.message || "Une erreur s’est produite. Veuillez réessayer."
            );
        },
    });

    useLockBodyScroll(!!selectedReservation);
    useEscKeyDown(!!selectedReservation, () => { deleteReservation.reset(); setSelectedReservation(null) })

    if (!userId) {
        return <div>Vous devez être connecté pour voir vos réservations.</div>;
    }

    if (isLoading) {
        return <div>Chargement des réservations...</div>;
    }

    if (error) {
        return <div>Impossible de charger les réservations.</div>;
    }



    return (
        <section>

            <h1 className="reservations-h1">Mes réservations</h1>

            {reservations.length === 0 ?

                (
                    <p className="reservations-text">Vous n’avez aucune réservation à venir.</p>
                )
                :
                (
                    <ul className="reservations-list">
                        {reservations.map((reservation) => (
                            <li key={reservation.id} className="reservation-item">
                                <span>
                                    {new Date(reservation.starts_at).toLocaleString("fr-FR", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "long",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>

                                <button onClick={() => { deleteReservation.reset(); setSelectedReservation(reservation); }}
                                    className="delete-door-button" type="button"
                                    aria-label={`Cancel reservation for ${new Date(reservation.starts_at).toLocaleString("fr-FR")}`}>
                                    <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}


            {selectedReservation && (

                <div className="confirmation-modal">

                    <p>
                        Voulez-vous supprimer votre réservation ? Cette action est irréversible.
                    </p>

                    {deleteReservation.isError && (
                        <p className="error-text">
                            {deleteReservation.error.message}
                        </p>
                    )}

                    <div className="confirmation-buttons-wrapper">

                        <button className="confirmation-button delete" type="button" onClick={() => { deleteReservation.mutate(selectedReservation.id); }}
                            disabled={deleteReservation.isPending}>

                            <span>{deleteReservation.isPending ? "Suppression..." : "Oui"}</span>

                        </button>

                        <button
                            className="confirmation-button"
                            type="button"
                            onClick={() => { deleteReservation.reset(); setSelectedReservation(null) }}
                            disabled={deleteReservation.isPending}
                        >
                            <span>Non</span>

                        </button>

                    </div>



                </div>

            )}

            {selectedReservation && <HiddenOverlay onClose={() => {
                if (!deleteReservation.isPending) {
                    deleteReservation.reset();
                    setSelectedReservation(null);
                }
            }} type="sidebar" />}

            {confirmationMessage && (
                <ConfirmationMessage
                    message={confirmationMessage}
                    onClose={() => setConfirmationMessage(null)}
                />
            )}

        </section >
    );

};

export default Reservations;