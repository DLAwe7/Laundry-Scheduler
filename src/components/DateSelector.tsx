import { faChevronLeft, faChevronRight, faSun, faCloudSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DateSelector.css"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import type { SegmentString } from "../pages/Scheduler";


type DateSelectorProps = {
    currentDay: Date;
    segment: SegmentString;
    setSegment: React.Dispatch<React.SetStateAction<SegmentString>>;
    setCurrentDay: React.Dispatch<React.SetStateAction<Date>>;
    today: Date;
}

type SegmentFiltersItem = {
    id: "sun" | "cloud" | "moon";
    icon: IconDefinition;
    ariaLabel: string;
}

const segmentFilters: SegmentFiltersItem[] = [

    { id: "sun", icon: faSun, ariaLabel: "Filter Day Time" },
    { id: "cloud", icon: faCloudSun, ariaLabel: "Filter Afternoon Time" },
    { id: "moon", icon: faMoon, ariaLabel: "Filter Night Time" },


]

function DateSelector({ currentDay, setCurrentDay, segment, setSegment, today }: DateSelectorProps) {

    const [direction, setDirection] = useState<"left" | "right" | null>(null);

    const onFiltering = (value: SegmentString) => {
        setSegment(prev => (prev === value ? "" : value));
    };

    const normalizeDate = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
    };

    const normalizedToday = normalizeDate(today);
    const normalizedCurrent = normalizeDate(currentDay);

    const goPrevDay = () => {

        setCurrentDay(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);

            if (normalizeDate(d).getTime() < normalizedToday.getTime()) {
                return prev;
            }

            return d;
        });
    };

    const goNextDay = () => {

        setCurrentDay(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            return d;
        });
    };

    const canGoPrev = normalizedCurrent.getTime() > normalizedToday.getTime();

    return (

        <section className="date-selector-wrapper">

            <div className='date-selector-container'>

                <button className="date-selector-button" onClick={() => { setDirection("left"); goPrevDay(); }} disabled={!canGoPrev} aria-label='Move to Previous Day'>

                    <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />

                </button>

                <span className={`date-displayer ${direction ?? ""}`}>

                    {currentDay.toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                    })}

                </span>

                <button className="date-selector-button" onClick={() => { setDirection("right"); goNextDay(); }} aria-label='Move to Next Day'>

                    <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />

                </button>

            </div>



            <ul className='day-segment-filters'>

                {segmentFilters.map(item => {

                    const isActive = segment === item.id;

                    return (


                        <li key={item.id} className={`segment-filters-item ${isActive ? "active" : ""}`}>

                            <button className="segment-filters-button" onClick={() => onFiltering(item.id)} aria-label={item.ariaLabel}
                                aria-pressed={isActive}>

                                <FontAwesomeIcon icon={item.icon} aria-hidden="true" />

                            </button>

                        </li>



                    );

                })}

            </ul>

        </section>


    )


}

export default DateSelector;