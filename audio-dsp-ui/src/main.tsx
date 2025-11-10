import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Auth/AuthContext.tsx'
import { TracksProvider } from './Providers/TracksContext.tsx'
import { AudioPlaybackCacheProvider } from './Providers/AudioPlaybackCacheContext.tsx'
import { UIStateProvider } from './Providers/UIStateProvider.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TracksProvider>
        <UIStateProvider>
           <AudioPlaybackCacheProvider>
          <App></App>
          </AudioPlaybackCacheProvider>
        </UIStateProvider>
      </TracksProvider>
      
    </AuthProvider>
   </QueryClientProvider>
  </StrictMode>,
)
