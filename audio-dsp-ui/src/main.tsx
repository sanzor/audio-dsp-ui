import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Auth/AuthContext.tsx'
import { TracksProvider } from './Providers/TracksContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TracksProvider>
      <App></App>
      </TracksProvider>
      
    </AuthProvider>
   
  </StrictMode>,
)
