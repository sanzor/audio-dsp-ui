// src/contexts/TrackContext.tsx
import { createContext, useEffect, useState, useCallback, type ReactNode, useRef } from 'react'
import type { TrackMeta } from '@/Domain/Track/TrackMeta'
import { apiAddTrack, apiGetTracks, apiRemoveTrack, apiUpdateTrack } from '@/Services/TracksService'
import type { AddTrackParams } from '@/Dtos/Tracks/AddTrackParams'
import type { AddTrackResult } from '@/Dtos/Tracks/AddTrackResult'
import type { RemoveTrackParams } from '@/Dtos/Tracks/RemoveTrackParams'
import type { RemoveTrackResult } from '@/Dtos/Tracks/RemoveTrackResult'
import { useAuth } from '@/Auth/UseAuth'
import type { UpdateTrackParams } from '@/Dtos/Tracks/UpdateTrackParams'
import type { UpdateTrackResult } from '@/Dtos/Tracks/UpdateTrackResult'
import { normalizeTrackWithCascade } from '@/Orchestrators/Tracks/utils'
import { useTrackStore } from '@/Stores/TrackStore'
import { useRegionSetStore } from '@/Stores/RegionSetStore'
import { useRegionStore } from '@/Stores/RegionStore'
import { useGraphStore } from '@/Stores/GraphStore'


// --- Types
interface TrackContextType {
  tracks: TrackMeta[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addTrack: (params: AddTrackParams) => Promise<AddTrackResult>
  updateTrack:(params:UpdateTrackParams)=>Promise<UpdateTrackResult>
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
const syncStoresWithTracks = (tracks: TrackMeta[]): void => {
  const setAllTracks = useTrackStore.getState().setAllTracks;
  const resetRegionSets = useRegionSetStore.getState().setAllRegionSets;
  const resetRegions = useRegionStore.getState().setAllRegions;
  const resetGraphs = useGraphStore.getState().setAllGraphs;

  resetRegionSets([]);
  resetRegions([]);
  resetGraphs([]);

  const normalized = tracks.map(normalizeTrackWithCascade);
  setAllTracks(normalized);
};

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
    syncStoresWithTracks(data);
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
  const updateTrack=async(params:UpdateTrackParams):Promise<UpdateTrackResult>=>{
    console.log("inside update track before api request");
    const result=await apiUpdateTrack(params);
    console.log("inside update track - api");
    await refresh();
    return result;
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

  // const getTrackBlob=async(trackId:string):Promise<Track>{
    
  // }
  return (
    <TrackContext.Provider value={{ tracks, loading, error, refresh, addTrack,updateTrack, removeTrack, listTracks }}>
      {children}
    </TrackContext.Provider>
  )
}

// --- Hook
