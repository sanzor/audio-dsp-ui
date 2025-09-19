// src/contexts/TrackContext.tsx
import { createContext, useEffect, useState, useCallback, type ReactNode, useRef } from 'react'
import type { TrackMeta } from '@/Domain/TrackMeta'
import { useAuth } from '@/Auth/UseAuth'
import type { TrackRegionSet } from '@/Domain/TrackRegionSet'
import type { CreateRegionSetParams } from '@/Dtos/RegionSets/CreateRegionSetParams'
import type { CreateRegionSetResult } from '@/Dtos/RegionSets/CreateRegionSetResult'
import type { EditRegionSetParams as UpdateRegionSetParams } from '@/Dtos/RegionSets/EditRegionSetParams'
import type { EditRegionSetResult } from '@/Dtos/RegionSets/EditRegionSetResult'
import type { RemoveRegionSetParams } from '@/Dtos/RegionSets/RemoveRegionSetParams'
import { apiCreateRegionSet, apiGetAllRegionSets, apiGetRegionSetsForTrack, apiRemoveRegionSet, apiUpdateRegionSet } from '@/Services/RegionSetsService'
import type { GetRegionSetsForTrackResult } from '@/Dtos/RegionSets/GetRegionSetsForTrackResult'
import type { GetRegionSetsResult } from '@/Dtos/RegionSets/GetRegionSetsResult'


// --- Types
interface RegionSetContextType {
  trackRegionSetsMap: Map<string,TrackRegionSet[]>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createRegionSet: (params: CreateRegionSetParams) => Promise<CreateRegionSetResult>
  updateRegionSet:(params:UpdateRegionSetParams)=>Promise<EditRegionSetResult>
  removeRegionSet: (params: RemoveRegionSetParams) => Promise<void>

  getRegionSetsFor:(trackId:string)=>Promise<TrackMeta[]>
  getRegionSet:(regionSetId:string)=>TrackRegionSet|null;
}
interface TracksProviderProps {
  children: ReactNode
}
// --- Context
// eslint-disable-next-line react-refresh/only-export-components
export const TrackContext = createContext<RegionSetContextType | null>(null)

// --- Provider
export const TracksProvider = ({ children }: TracksProviderProps) => {
  const { user, loading: authLoading } = useAuth(); // ✅ correctly rename this
  const [trackRegionSetsMap, setTrackRegionSetsMap] = useState<Map<string,TrackRegionSet[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasRefreshed = useRef(false);
  const refresh = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
   
    const data = await apiGetAllRegionSets();
    setTrackRegionSetsMap(data.track_region_sets_map);
    // console.log("✅ Fetched tracks:", data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err.message || 'Failed to fetch region sets');
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
  if (authLoading || !user || hasRefreshed.current) return;

  hasRefreshed.current = true;
  refresh();
}, [authLoading, user, refresh]);
  const createRegionSet = async (params: CreateRegionSetParams):Promise<CreateRegionSetResult>=> {
    console.log("inside add region set - context");
    const result=await apiCreateRegionSet(params)
    await refresh()
    return result
  }
  const updateRegionSet=async(params:UpdateRegionSetParams):Promise<EditRegionSetResult>=>{
    console.log("inside update region set before api request");
    const result=await apiUpdateRegionSet(params);
    console.log("inside update region set - api");
    await refresh();
    return result;
  }
  const removeRegionSet = async (params: RemoveRegionSetParams):Promise<void> => {
    const result=await apiRemoveRegionSet(params)
    await refresh();
    return result;
  }

  const listRegionSets=async():Promise<GetRegionSetsResult>=>{
    const result=await apiGetAllRegionSets();
    return result;
  }
  const listRegionSetsForTrack=async():Promise<GetRegionSetsForTrackResult>=>{
    const result=await apiGetRegionSetsForTrack();
    return result;
  }

  // const getTrackBlob=async(trackId:string):Promise<Track>{
    
  // }
  return (
    <TrackContext.Provider value={{ trackRegionSetsMap, loading, error, refresh, createRegionSet,updateRegionSet, removeRegionSet, list }}>
      {children}
    </TrackContext.Provider>
  )
}

// --- Hook
