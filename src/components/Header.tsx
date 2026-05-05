import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.css"
import Sidebar from "./Sidebar";
import type { Theme } from "../hooks/usePreferences";
import ToggleThemeButton from "./ToggleThemeButton";


type HeaderProps = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}



function Header({ isSidebarOpen, setIsSidebarOpen, theme, setTheme }: HeaderProps) {


    return (<>

        <header className='header'>

            <button onClick={() => setIsSidebarOpen(true)} className='sidebar-opener' aria-label='Ouvrir le menu'
                aria-controls="header-sidebar" aria-expanded={isSidebarOpen}>

                <FontAwesomeIcon icon={faBars} aria-hidden="true" />

            </button>

            <ToggleThemeButton theme={theme} setTheme={setTheme} />

        </header>


        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

    </>)



}

export default Header;