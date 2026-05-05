import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import type { Theme } from "../hooks/usePreferences";

type AppShellProps = {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}


function AppShell({ theme, setTheme }: AppShellProps) {


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} theme={theme} setTheme={setTheme} />

            <main inert={isSidebarOpen ? true : undefined} className="main">

                <Outlet />

            </main>

        </>
    );
}


export default AppShell;