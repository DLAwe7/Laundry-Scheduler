import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ProtectedRoute() {
    const { session, loading } = useApp();
    const location = useLocation();

    if (loading) {
        return <p>Chargement de l’authentification...</p>;
    }

    if (!session) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

export default ProtectedRoute;