import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

export type AppTime = {
    now_utc: string;
    today_local: string;
    timezone: string;
};

async function fetchAppTime(): Promise<AppTime> {

    const { data, error } = await supabase.rpc("app_time");

    if (error) {
        throw new Error(error.message);
    }

    return data as AppTime;
}

function useAppTime() {
    return useQuery({
        queryKey: ["app-time"],
        queryFn: fetchAppTime,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 30 * 60 * 1000,
        refetchIntervalInBackground: true,
        retry: 2,
    });
}

export default useAppTime;