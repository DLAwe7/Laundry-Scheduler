import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useState } from "react";
import "./AdminPanel.css"
import InspectMode from "../components/InspectMode";
import DeleteMode from "../components/DeleteMode";


function AdminPanel() {

    const [mode, setMode] = useState<"inspect" | "delete">("inspect");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const { session, profile, loading } = useApp();

    if (loading) return null;

    if (!session) {
        return <Navigate to="/" replace />;
    }

    if (!profile) {
        return null;
    }

    if (profile.role !== "admin") {
        return <Navigate to="/app" replace />;

    }

    return (

        <>

            <div className="mode-selector-wrapper">

                <button className={`mode-selector-item ${mode === "inspect" ? "active" : ""}`} onClick={() => setMode("inspect")}>
                    <span>Inspection</span>
                </button>

                {" | "}

                <button className={`mode-selector-item ${mode === "delete" ? "active" : ""}`} onClick={() => setMode("delete")}>
                    <span>Suppression</span>
                </button>

            </div>

            {mode === "inspect" ?
                (<InspectMode searchTerm={searchTerm} setSearchTerm={setSearchTerm} />)
                :
                (<DeleteMode searchTerm={searchTerm} setSearchTerm={setSearchTerm} />)
            }

        </>



    )


};

export default AdminPanel;