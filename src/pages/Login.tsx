import { Navigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import { useApp } from "../context/AppContext";

function Login() {

    const { session, profile, loading } = useApp();

    if (loading) {
        return <p>Chargement de l’authentification...</p>;
    }

    if (profile?.role === "admin") {
        return <Navigate to="/app/admin" replace />;
    }

    if (session) {
        return <Navigate to="/app" replace />;
    }

    return (


        <RegistrationForm />


    );

};

export default Login;