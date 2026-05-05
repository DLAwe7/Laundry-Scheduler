import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";


export type Profile = {
    id: string;
    door_number: string;
    role: "user" | "admin";
    created_at: string;
}

type AuthContextType = {
    session: Session | null;
    profile: Profile | null;
    loading: boolean;
    error: Error | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useApp() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useApp must be used inside AuthProvider");
    }

    return context;
}