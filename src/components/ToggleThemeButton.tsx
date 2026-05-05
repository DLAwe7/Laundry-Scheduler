import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Theme } from "../hooks/usePreferences";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import "./ToggleThemeButton.css"


type ToggleThemeButtonProps = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}


function ToggleThemeButton({ theme, setTheme }: ToggleThemeButtonProps) {




    return (

        <div className="toggle-theme-wrapper">

            <button className={`toggle-theme-button ${theme === "light" ? "active" : ""}`} type="button" onClick={() => setTheme("light")} aria-label="Passer en mode clair">

                <FontAwesomeIcon icon={faSun} aria-hidden="true" />

            </button>

            {" | "}

            <button className={`toggle-theme-button ${theme === "dark" ? "active" : ""}`} type="button" onClick={() => setTheme("dark")} aria-label="Passer en mode sombre">

                <FontAwesomeIcon icon={faMoon} aria-hidden="true" />

            </button>

        </div>


    );

};

export default ToggleThemeButton;