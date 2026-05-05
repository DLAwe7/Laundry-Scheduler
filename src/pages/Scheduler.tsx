import { useState } from "react";
import DateSelector from "../components/DateSelector";
import TimeStampsList from "../components/TimeStampsList";
import useAppTime from "../hooks/useAppTime";


export type SegmentString = "sun" | "cloud" | "moon" | "";



function parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}


function SchedulerContent({ today, appNow }: { today: Date, appNow: Date }) {

    const [currentDay, setCurrentDay] = useState<Date>(() => new Date(today));
    const [segment, setSegment] = useState<SegmentString>("");

    return (
        <>
            <DateSelector
                segment={segment}
                setSegment={setSegment}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
                today={today}
            />

            <TimeStampsList currentDay={currentDay} segment={segment} appNow={appNow} />
        </>
    );
}


function Scheduler() {

    const { data, isLoading, error } = useAppTime();

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Impossible de charger l’heure de l’application.</div>;
    if (!data) return <div>Heure de l’application indisponible.</div>;

    const today = parseLocalDate(data.today_local);
    const appNow = new Date(data.now_utc);

    return <SchedulerContent today={today} appNow={appNow} />;
}

export default Scheduler;