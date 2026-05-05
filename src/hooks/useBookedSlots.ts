import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { getDateKey, getWeekStart } from "../utils/dateHelpers";

export type BookedSlot = {
    starts_at: string;
    ends_at: string;
};

export function useBookedSlots(currentDay: Date) {
    const blockStart = getWeekStart(currentDay);

    const blockEnd = new Date(blockStart);
    blockEnd.setDate(blockStart.getDate() + 7);

    const blockKey = getDateKey(blockStart);

    return useQuery<BookedSlot[]>({
        queryKey: ["booked-slots", blockKey],
        queryFn: async () => {
            const { data, error } = await supabase.rpc("get_booked_slots", {
                p_start: blockStart.toISOString(),
                p_end: blockEnd.toISOString(),
            });

            if (error) throw error;

            return data ?? [];
        },
        staleTime: 60_000,
    });
}