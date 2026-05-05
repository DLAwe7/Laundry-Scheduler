import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './context/AppProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <StrictMode>

    <QueryClientProvider client={queryClient}>

      <AppProvider>

        <BrowserRouter >

          <ScrollToTop />
          <App />

        </BrowserRouter>

      </AppProvider>

    </QueryClientProvider>

  </StrictMode>,

)
