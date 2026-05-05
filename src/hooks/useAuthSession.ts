import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";


function useAuthSession() {

    const [session, setSession] = useState<Session | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function getInitialSession() {

            const { data, error } = await supabase.auth.getSession();

            if (!isMounted) return;

            if (error) {
                console.error("Error getting session:", error.message);
                setAuthLoading(false);
                return;
            }

            setSession(data.session);
            setAuthLoading(false);
        }

        getInitialSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setAuthLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return {
        session,
        authLoading,
    };


};


export default useAuthSession;