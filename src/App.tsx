import './App.css'
import { Routes, Route } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Reservations from './pages/Reservations';
import Scheduler from './pages/Scheduler';
import Login from './pages/Login';
import AppShell from './pages/AppShell';
import { usePreferences } from './hooks/usePreferences';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  const { theme, setTheme } = usePreferences();

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return (

    <Routes>


      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell theme={theme} setTheme={setTheme} />}>
          <Route index element={<Scheduler />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Route>



    </Routes>

  )
}

export default App
