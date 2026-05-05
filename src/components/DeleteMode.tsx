import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Searchbar from "./Searchbar";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import HiddenOverlay from "./HiddenOverlay";
import ConfirmationMessage from "./ConfirmationMessage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { useEscKeyDown } from "../hooks/useEscKeyDown";

type DeleteModeProps = {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

type Resident = {
    id: string;
    door_number: string | number | null;
    role: string | null;
};

function DeleteMode({ searchTerm, setSearchTerm }: DeleteModeProps) {
    const queryClient = useQueryClient();

    const [selectedDoorNumber, setSelectedDoorNumber] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

    const { data: residents = [], isLoading, error, } = useQuery<Resident[]>({
        queryKey: ["admin-residents"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, door_number, role")
                .neq("role", "admin")
                .order("door_number", { ascending: true });

            if (error) throw error;

            return data ?? [];
        },
    });

    const deleteResident = useMutation({
        mutationFn: async (doorNumber: string) => {
            const { error } = await supabase.functions.invoke("delete-resident", {
                body: {
                    door_number: doorNumber,
                },
            });

            if (error) throw error;
        },

        onSuccess: async (_data, doorNumber) => {
            await queryClient.invalidateQueries({ queryKey: ["admin-residents"] });
            await queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });

            setSelectedDoorNumber(null);
            setConfirmationMessage(`Résident ${doorNumber} supprimé.`);
        },

        onError: (error: Error) => {
            setConfirmationMessage(
                error.message || "Une erreur s’est produite. Veuillez réessayer."
            );
        },
    });

    const filteredResidents = residents.filter((resident) => {
        const query = searchTerm.trim().toLowerCase();
        const doorNumber = String(resident.door_number ?? "").toLowerCase();

        return !query || doorNumber.includes(query);
    });

    useLockBodyScroll(!!selectedDoorNumber);
    useEscKeyDown(!!selectedDoorNumber, () => { deleteResident.reset(); setSelectedDoorNumber(null) });

    if (isLoading) return <div>Chargement des résidents...</div>;
    if (error) return <div>Impossible de charger les résidents.</div>;

    return (
        <>
            <Searchbar
                inputId="inspect-input"
                inputTitle="Filtrer les numéros de porte"
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />

            <section>
                <div className="door-numbers-header">
                    <span>Numéro de porte</span>
                    <span>Bouton de suppression</span>
                </div>

                <ul className="door-numbers-list">


                    {filteredResidents.length === 0 ?

                        (<li className="door-numbers-item empty">
                            <span>Aucun utilisateur trouvé.</span>
                        </li>)

                        :

                        (filteredResidents.map((resident) => {
                            const doorNumber = String(resident.door_number ?? "Unknown");

                            return (
                                <li key={resident.id} className="door-numbers-item">
                                    <span>{doorNumber}</span>

                                    <button
                                        className="delete-door-button"
                                        onClick={() => { deleteResident.reset(); setSelectedDoorNumber(doorNumber); }}
                                        disabled={doorNumber === "Unknown"}
                                        aria-label={`Delete resident from door number ${doorNumber}`}
                                    >
                                        <FontAwesomeIcon icon={faXmark} aria-hidden="true" />

                                    </button>
                                </li>
                            );
                        }))

                    }


                </ul>
            </section >

            {selectedDoorNumber && (

                <div className="confirmation-modal">

                    <p>
                        Voulez-vous supprimer l’utilisateur {selectedDoorNumber} ? Cette action est irréversible.
                    </p>

                    {deleteResident.isError && (
                        <p className="error-text">
                            {deleteResident.error.message}
                        </p>
                    )}

                    <div className="confirmation-buttons-wrapper">

                        <button className="confirmation-button delete" type="button"
                            onClick={() => { deleteResident.mutate(selectedDoorNumber) }} disabled={deleteResident.isPending}>

                            <span>{deleteResident.isPending ? "Suppression..." : "Oui"}</span>

                        </button>

                        <button
                            className="confirmation-button"
                            type="button"
                            onClick={() => { deleteResident.reset(); setSelectedDoorNumber(null) }}
                            disabled={deleteResident.isPending}
                        >
                            <span>Non</span>

                        </button>

                    </div>

                </div>

            )
            }

            {selectedDoorNumber && <HiddenOverlay onClose={() => {
                if (!deleteResident.isPending) {
                    deleteResident.reset();
                    setSelectedDoorNumber(null);
                }
            }} type="sidebar" />}

            {confirmationMessage && (
                <ConfirmationMessage
                    message={confirmationMessage}
                    onClose={() => setConfirmationMessage(null)}
                />
            )}
        </>
    );
}

export default DeleteMode;