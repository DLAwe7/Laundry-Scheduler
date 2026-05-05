import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";


function LogoutButton() {

    const navigate = useNavigate();

    const handleLogout = async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error.message);
            return;
        }

        navigate("/");
    };

    return <button onClick={handleLogout}>Déconnexion</button>;
}

export default LogoutButton;