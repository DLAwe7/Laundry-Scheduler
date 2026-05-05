import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FocusScope } from "@radix-ui/react-focus-scope";
import HiddenOverlay from "./HiddenOverlay";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css"
import { useRef } from "react";
import useArrowNavigation from "../hooks/useArrowNavigation";
import useAutoFocusOnOpen from "../hooks/useAutoFocusOnOpen";
import { useEscKeyDown } from "../hooks/useEscKeyDown";
import { useInert } from "../hooks/useInert";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import LogoutButton from "./LogoutButton";
import SidebarNavItem from "./SidebarNavItem";
import { useApp } from "../context/AppContext";



type SidebarProps = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

}

function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {

    const { profile } = useApp();


    const asideRef = useRef(null);

    useInert(asideRef, !isSidebarOpen);
    useLockBodyScroll(isSidebarOpen);
    useArrowNavigation(isSidebarOpen, asideRef);
    useAutoFocusOnOpen(isSidebarOpen, asideRef);
    useEscKeyDown(isSidebarOpen, () => setIsSidebarOpen(false));

    return (

        <>

            <FocusScope loop trapped={isSidebarOpen}>

                <aside ref={asideRef} id="header-sidebar" className={`main-sidebar  ${isSidebarOpen ? " open" : ""}`}>

                    <nav className={`sidebar-navigation`}>

                        <div className="sidebar-closing-button-container">

                            <button className="sidebar-closing-button" onClick={() => setIsSidebarOpen(false)} aria-expanded={isSidebarOpen}
                                aria-label="Close Sidebar" aria-controls="header-sidebar">

                                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />

                            </button>

                        </div>

                        <ul className="sidebar-list">
                            <SidebarNavItem
                                to="/app"
                                end
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span>Choix d’un créneau</span>
                            </SidebarNavItem>

                            <SidebarNavItem
                                to="/app/reservations"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span>Mes réservations</span>
                            </SidebarNavItem>

                            {profile?.role === "admin" && < SidebarNavItem
                                to="/app/admin"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span>Space d’administration</span>
                            </SidebarNavItem>}

                            <li className="sidebar-item">
                                <LogoutButton />
                            </li>
                        </ul>

                    </nav>

                </aside>

            </FocusScope >

            {isSidebarOpen && <HiddenOverlay onClose={() => setIsSidebarOpen(false)} type='sidebar' />
            }

        </>



    );



};



export default Sidebar;