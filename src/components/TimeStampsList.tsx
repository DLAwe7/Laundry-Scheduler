
import "./TimeStampsList.css";
import { supabase } from "../lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import type { SegmentString } from "../pages/Scheduler";
import { useState } from "react";
import ConfirmationMessage from "./ConfirmationMessage";
import HiddenOverlay from "./HiddenOverlay";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useEscKeyDown } from "../hooks/useEscKeyDown";


type TimeStampsListProps = {
    segment: SegmentString;
    currentDay: Date;
    appNow: Date;
}

type CreateReservationInput = {
    startTime: Date;
    endTime: Date;
};

type BookedSlot = {
    starts_at: string;
    ends_at: string;
};

const formatTime = (date: Date) =>
    date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

function TimeStampsList({ currentDay, segment, appNow }: TimeStampsListProps) {

    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<CreateReservationInput | null>(null);


    const dayKey = `${currentDay.getFullYear()}-${String(
        currentDay.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;

    const queryClient = useQueryClient();
    const { session } = useApp();

    const currentHour = new Date(appNow);
    currentHour.setMinutes(0, 0, 0);

    const buildDateTime = (day: Date, hour: number): Date => {
        const dateTime = new Date(day);
        dateTime.setHours(hour, 0, 0, 0);
        return dateTime;
    };

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


    const ranges = {
        sun: [8, 14],
        cloud: [16, 22],
        moon: [0, 6],
    };

    const [min, max] = segment ? ranges[segment] : [0, 23];

    const SLOT_DURATION_HOURS = 2;

    const timeStamps = Array.from({ length: 12 }, (_, index) => {

        const hour = index * SLOT_DURATION_HOURS;

        const startTime = buildDateTime(currentDay, hour);
        const endTime = buildDateTime(currentDay, hour + 2);

        return {
            id: `timeStamp${hour}`,
            hour,
            value: `${String(hour).padStart(2, "0")}:00 - ${String((hour + 2) % 24).padStart(2, "0")}:00`,
            startTime,
            endTime,
        };
    });

    const filteredStamps = timeStamps.filter(t => t.hour >= min && t.hour <= max);



    const { data: reservations = [], isLoading, error } = useQuery<BookedSlot[]>({
        queryKey: ["booked-slots", dayKey],
        queryFn: async () => {
            const dayStart = new Date(currentDay);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(currentDay);
            dayEnd.setHours(24, 0, 0, 0);

            const { data, error } = await supabase.rpc("get_booked_slots", {
                p_start: dayStart.toISOString(),
                p_end: dayEnd.toISOString(),
            });

            if (error) throw error;

            return data ?? [];
        },
    });



    useLockBodyScroll(!!selectedSlot);
    useEscKeyDown(!!selectedSlot, () => { createReservation.reset(); setSelectedSlot(null) });

    if (isLoading) return <div>Chargement des créneaux...</div>;
    if (error) return <div>Impossible de charger les créneaux.</div>;

    return (

        <>


            <ul className='time-stamps-list'>

                {filteredStamps.map((slot) => {

                    const isReserved = reservations.some(r => {
                        const reservationStart = new Date(r.starts_at);
                        const reservationEnd = new Date(r.ends_at);

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

            {selectedSlot && (

                <div className="confirmation-modal">

                    <p>
                        Voulez-vous réserver de {formatTime(selectedSlot.startTime)} à {formatTime(selectedSlot.endTime)} ?
                    </p>

                    {createReservation.isError && (
                        <p className="error-text">
                            {createReservation.error.message}
                        </p>
                    )}

                    <div className="confirmation-buttons-wrapper">

                        <button className="confirmation-button create" type="button"
                            onClick={() => {
                                createReservation.mutate({
                                    startTime: selectedSlot.startTime,
                                    endTime: selectedSlot.endTime,
                                })
                            }} disabled={createReservation.isPending}>

                            <span>{createReservation.isPending ? "Réservation en cours..." : "Oui"}</span>

                        </button>

                        <button
                            className="confirmation-button"
                            type="button"
                            onClick={() => { createReservation.reset(); setSelectedSlot(null) }}
                            disabled={createReservation.isPending}
                        >
                            <span>Non</span>

                        </button>

                    </div>

                </div>

            )
            }

            {selectedSlot && <HiddenOverlay onClose={() => {
                if (!createReservation.isPending) {
                    createReservation.reset();
                    setSelectedSlot(null);
                }
            }} type="sidebar" />}

            {
                confirmationMessage && (
                    <ConfirmationMessage
                        message={confirmationMessage}
                        onClose={() => setConfirmationMessage(null)}
                    />
                )
            }

        </>


    );

};


export default TimeStampsList;