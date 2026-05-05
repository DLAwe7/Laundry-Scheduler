import type { SegmentString } from "../pages/Scheduler";

const SLOT_DURATION_HOURS = 2;

const ranges = {
    sun: [8, 14],
    cloud: [16, 22],
    moon: [0, 6],
} as const;

function buildDateTime(day: Date, hour: number): Date {
    const dateTime = new Date(day);
    dateTime.setHours(hour, 0, 0, 0);
    return dateTime;
}

export function getTimeSlots(currentDay: Date, segment: SegmentString) {
    const [min, max] = segment ? ranges[segment] : [0, 23];

    const timeStamps = Array.from({ length: 12 }, (_, index) => {
        const hour = index * SLOT_DURATION_HOURS;

        const startTime = buildDateTime(currentDay, hour);
        const endTime = buildDateTime(currentDay, hour + 2);

        return {
            id: `timeStamp${hour}`,
            hour,
            value: `${String(hour).padStart(2, "0")}:00 - ${String(
                (hour + 2) % 24
            ).padStart(2, "0")}:00`,
            startTime,
            endTime,
        };
    });

    return timeStamps.filter((timeStamp) => {
        return timeStamp.hour >= min && timeStamp.hour <= max;
    });
}