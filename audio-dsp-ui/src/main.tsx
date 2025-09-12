import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Auth/AuthContext.tsx'
import { TracksProvider } from './Providers/TracksContext.tsx'
import { AudioPlaybackCacheProvider } from './Providers/AudioPlaybackCacheContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TracksProvider>
      <AudioPlaybackCacheProvider>
      <App></App>
      </AudioPlaybackCacheProvider>
      </TracksProvider>
      
    </AuthProvider>
   
  </StrictMode>,
)
