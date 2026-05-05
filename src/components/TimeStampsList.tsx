
import "./TimeStampsList.css";
import { supabase } from "../lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import type { SegmentString } from "../pages/Scheduler";
import { useState } from "react";
import ConfirmationMessage from "./ConfirmationMessage";
import HiddenOverlay from "./HiddenOverlay";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useEscKeyDown } from "../hooks/useEscKeyDown";
import { formatTime } from "../utils/dateHelpers";
import ConfirmationModal from "./ConfirmationModal";
import { useBookedSlots } from "../hooks/useBookedSlots";
import { getTimeSlots } from "../utils/timeSlotHelpers";


type TimeStampsListProps = {
    segment: SegmentString;
    currentDay: Date;
    appNow: Date;
}

export type CreateReservationInput = {
    startTime: Date;
    endTime: Date;
};


function TimeStampsList({ currentDay, segment, appNow }: TimeStampsListProps) {

    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<CreateReservationInput | null>(null);

    const queryClient = useQueryClient();
    const { session } = useApp();

    const currentHour = new Date(appNow);
    currentHour.setMinutes(0, 0, 0);

    const createReservation = useMutation({

        mutationFn: async ({ startTime, endTime }: CreateReservationInput) => {

            const userId = session?.user.id;

            if (!userId) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('reservations')
                .insert([
                    {
                        starts_at: startTime.toISOString(),
                        ends_at: endTime.toISOString(),
                        user_id: userId,
                    },
                ]);

            if (error) {

                throw error;
            }
        },

        onSuccess: (_data, { startTime, endTime }) => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["booked-slots"] });

            setSelectedSlot(null);

            setConfirmationMessage(
                `Votre réservation de ${formatTime(startTime)} à ${formatTime(endTime)} a été créée.`
            );
        },

        onError: (error: Error & { code?: string }) => {
            if (
                error.code === "23505" ||
                error.message.includes("reservations_unique_slot")
            ) {
                setConfirmationMessage("Ce créneau est déjà réservé.");
                return;
            }

            if (error.message.includes("User can only have 2 active reservations")) {
                setConfirmationMessage("Vous ne pouvez avoir que 2 réservations actives.");
                return;
            }

            setConfirmationMessage("Une erreur est survenue.");
        }
    });

    const filteredStamps = getTimeSlots(currentDay, segment);

    const { data: bookedSlots = [], isLoading, error, } = useBookedSlots(currentDay);


    useLockBodyScroll(!!selectedSlot);
    useEscKeyDown(!!selectedSlot, () => {
        if (!createReservation.isPending) {
            createReservation.reset();
            setSelectedSlot(null);
        }
    });



    if (isLoading) return <div>Chargement des créneaux...</div>;
    if (error) return <div>Impossible de charger les créneaux.</div>;

    return (

        <>
            <ul className='time-stamps-list'>

                {filteredStamps.map((slot) => {

                    const isReserved = bookedSlots.some(bookedSlot => {
                        const reservationStart = new Date(bookedSlot.starts_at);
                        const reservationEnd = new Date(bookedSlot.ends_at);

                        return (
                            reservationStart.getTime() < slot.endTime.getTime() &&
                            reservationEnd.getTime() > slot.startTime.getTime()
                        );
                    });

                    const isPastOrCurrentHour =
                        slot.startTime.getTime() <= currentHour.getTime();

                    const isBooked = isReserved || isPastOrCurrentHour;

                    return (

                        <li key={slot.id} className={`time-stamps-item ${isBooked ? "booked" : ""}`}>

                            <button onClick={() => {
                                createReservation.reset(); setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime });
                            }}
                                disabled={isBooked || createReservation.isPending}>
                                {slot.value}
                            </button>

                        </li>
                    );


                })}

            </ul >

            {selectedSlot && (<>

                <ConfirmationModal selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} createReservation={createReservation} />
                <HiddenOverlay onClose={() => { if (!createReservation.isPending) { createReservation.reset(); setSelectedSlot(null); } }} type="sidebar" />

            </>

            )
            }

            {confirmationMessage && (<ConfirmationMessage message={confirmationMessage} onClose={() => setConfirmationMessage(null)} />)}
        </>


    );

};


export default TimeStampsList;