import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import Searchbar from "./Searchbar";



type InspectModeProps = {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

type AdminReservation = {
    id: string;
    starts_at: string;
    ends_at: string;
    user_id: string;
    profiles: {
        door_number: string | number | null;
    } | null;
};

const formatReservationDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function InspectMode({ searchTerm, setSearchTerm }: InspectModeProps) {

    const { data: reservations = [], isLoading, error } = useQuery<AdminReservation[]>({
        queryKey: ["admin-reservations"],
        queryFn: async (): Promise<AdminReservation[]> => {
            const { data, error } = await supabase
                .from("reservations")
                .select(`
          id,
          starts_at,
          ends_at,
          user_id,
          profiles (
            door_number
          )
        `)
                .order("starts_at", { ascending: true });

            if (error) throw error;

            return (data ?? []) as unknown as AdminReservation[];
        },
    });

    const filteredResidents = reservations.filter((reservation) => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return true;

        const doorNumber = String(
            reservation.profiles?.door_number ?? ""
        ).toLowerCase();

        const startsAt = new Date(reservation.starts_at);

        const displayDate = formatReservationDate(reservation.starts_at).toLowerCase();

        const numericDate = startsAt.toLocaleDateString("fr-FR").toLowerCase();

        const hour = startsAt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        }).toLowerCase();

        const searchableText = `${doorNumber} ${displayDate} ${numericDate} ${hour}`;

        return searchableText.includes(query);
    });

    if (isLoading) return <div>Chargement des réservations...</div>;
    if (error) return <div>Impossible de charger les réservations.</div>;



    return (

        <>
            <Searchbar inputId={"delete-input"} inputTitle={"Filtrer les réservations"} searchTerm={searchTerm} onSearch={setSearchTerm} />

            <section>

                <div className="door-numbers-header"><span>Numéro de porte</span><span>Heure</span></div>

                <ul className="door-numbers-list">

                    {filteredResidents.length === 0 ?

                        (<li className="door-numbers-item empty">
                            <span>Aucune réservation trouvée.</span>
                        </li>)

                        :

                        (filteredResidents.map((reservation) => (

                            <li key={reservation.id} className="door-numbers-item">

                                <span>
                                    {reservation.profiles?.door_number ?? "Inconnu"}
                                </span>

                                <span>
                                    {formatReservationDate(reservation.starts_at)}
                                </span>

                            </li>)))
                    }

                </ul>

            </section>

        </>



    );



};

export default InspectMode;