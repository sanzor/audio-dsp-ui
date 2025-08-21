// src/contexts/TrackContext.tsx
import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { TrackMeta } from '@/Domain/TrackMeta'
import type { GetTrackParams } from '@/Dtos/Tracks/GetTrackParams'
import { apiAddTrack, apiGetTracks, apiRemoveTrack } from '@/Services/TracksService'


// --- Types
interface TrackContextType {
  tracks: TrackMeta[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addTrack: (params: GetTrackParams) => Promise<void>
  removeTrack: (params: GetTrackParams) => Promise<void>
}
interface TracksProviderProps {
  children: ReactNode
}
// --- Context
// eslint-disable-next-line react-refresh/only-export-components
export const TrackContext = createContext<TrackContextType | null>(null)

// --- Provider
export const TracksProvider = ({ children }: TracksProviderProps) => {
  const [tracks, setTracks] = useState<TrackMeta[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    refresh()
  }, [])
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetTracks()
      setTracks(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tracks')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTrack = async (params: GetTrackParams) => {
    await apiAddTrack(params)
    await refresh()
  }

  const removeTrack = async (params: GetTrackParams) => {
    await apiRemoveTrack(params)
    await refresh()
  }

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <TrackContext.Provider value={{ tracks, loading, error, refresh, addTrack, removeTrack }}>
      {children}
    </TrackContext.Provider>
  )
}

// --- Hook
