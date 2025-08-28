// src/contexts/TrackContext.tsx
import { createContext, useEffect, useState, useCallback, type ReactNode, useRef } from 'react'
import type { TrackMeta } from '@/Domain/TrackMeta'
import { apiAddTrack, apiGetTracks, apiRemoveTrack } from '@/Services/TracksService'
import type { AddTrackParams } from '@/Dtos/Tracks/AddTrackParams'
import type { AddTrackResult } from '@/Dtos/Tracks/AddTrackResult'
import type { RemoveTrackParams } from '@/Dtos/Tracks/RemoveTrackParams'
import type { RemoveTrackResult } from '@/Dtos/Tracks/RemoveTrackResult'
import { useAuth } from '@/Auth/UseAuth'


// --- Types
interface TrackContextType {
  tracks: TrackMeta[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addTrack: (params: AddTrackParams) => Promise<AddTrackResult>
  removeTrack: (params: RemoveTrackParams) => Promise<RemoveTrackResult>
  listTracks:()=>Promise<TrackMeta[]>
}
interface TracksProviderProps {
  children: ReactNode
}
// --- Context
// eslint-disable-next-line react-refresh/only-export-components
export const TrackContext = createContext<TrackContextType | null>(null)

// --- Provider
export const TracksProvider = ({ children }: TracksProviderProps) => {
  const { user, loading: authLoading } = useAuth(); // ✅ correctly rename this
  const [tracks, setTracks] = useState<TrackMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasRefreshed = useRef(false);
  const refresh = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
   
    const data = await apiGetTracks();
    setTracks(data);
    // console.log("✅ Fetched tracks:", data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err.message || 'Failed to fetch tracks');
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
  if (authLoading || !user || hasRefreshed.current) return;

  hasRefreshed.current = true;
  refresh();
}, [authLoading, user, refresh]);
  const addTrack = async (params: AddTrackParams):Promise<AddTrackResult>=> {
    console.log("inside add track - context");
    const result=await apiAddTrack(params)
    await refresh()
    return result
  }

  const removeTrack = async (params: RemoveTrackParams):Promise<RemoveTrackResult> => {
    const result=await apiRemoveTrack(params)
    await refresh();
    return result;
  }
  const listTracks=async():Promise<TrackMeta[]>=>{
    const result=await apiGetTracks();
    return result;
  }
  return (
    <TrackContext.Provider value={{ tracks, loading, error, refresh, addTrack, removeTrack, listTracks }}>
      {children}
    </TrackContext.Provider>
  )
}

// --- Hook
