// src/contexts/TrackContext.tsx
import React, { createContext, useEffect, useState, useCallback } from 'react'
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

// --- Context
// eslint-disable-next-line react-refresh/only-export-components
export const TrackContext = createContext<TrackContextType | null>(null)

// --- Provider
export const TrackProvider = ({ children }: { children: React.ReactNode }) => {
  const [tracks, setTracks] = useState<TrackMeta[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetTracks()
      setTracks(data)
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
