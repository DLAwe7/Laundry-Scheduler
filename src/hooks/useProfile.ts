import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../context/AppContext";


async function fetchProfile(userId: string): Promise<Profile | null> {

    const { data, error } = await supabase
        .from("profiles")
        .select("id, door_number, role, created_at")
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

function useProfile(userId: string | null) {
    return useQuery({
        queryKey: ["profile", userId],
        queryFn: () => fetchProfile(userId!),
        enabled: Boolean(userId),
        staleTime: 60 * 60 * 1000,
        retry: 2,
    });
}

export default useProfile;