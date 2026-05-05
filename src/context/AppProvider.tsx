import { useMemo, type ReactNode } from "react";
import { AuthContext } from "./AppContext";
import useAuthSession from "../hooks/useAuthSession";
import useProfile from "../hooks/useProfile";

export function AppProvider({ children }: { children: ReactNode }) {


    const { session, authLoading, } = useAuthSession();

    const userId = session?.user.id ?? null;

    const { data: profile = null, error: profileError, isLoading: profileLoading } = useProfile(userId);

    const loading = authLoading || profileLoading;
    const error = profileError || null;

    const value = useMemo(
        () => ({ session, profile, loading, error }),
        [session, profile, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}