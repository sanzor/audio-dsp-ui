
import { createContext, useEffect, useState, useCallback, type ReactNode, useRef } from 'react'
import { useAuth } from '@/Auth/UseAuth'
import type { TrackRegionSet } from '@/Domain/RegionSet/TrackRegionSet'
import type { CreateRegionSetParams } from '@/Dtos/RegionSets/CreateRegionSetParams'
import type { CreateRegionSetResult } from '@/Dtos/RegionSets/CreateRegionSetResult'
import type { EditRegionSetParams as UpdateRegionSetParams } from '@/Dtos/RegionSets/EditRegionSetParams'
import type { EditRegionSetResult } from '@/Dtos/RegionSets/EditRegionSetResult'
import type { RemoveRegionSetParams } from '@/Dtos/RegionSets/RemoveRegionSetParams'
import { apiCopyRegionSet, apiCreateRegionSet, apiGetAllRegionSets, apiGetRegionSetsForTrack, apiRemoveRegionSet, apiUpdateRegionSet } 
from '@/Services/RegionSetsService'
import type { CreateRegionParams } from '@/Dtos/Regions/CreateRegionParams'

import type { RemoveRegionParams } from '@/Dtos/Regions/RemoveRegionParams'
import { apiAddRegion, apiCopyRegion, apiEditRegion, apiRemoveRegion } from '@/Services/RegionsService'
import type { CopyRegionSetParams } from '@/Dtos/RegionSets/CoyRegionSetParams'
import type { CopyRegionParams } from '@/Dtos/Regions/CopyRegionParams'
import type { EditRegionParams } from '@/Dtos/Regions/EditRegionParams'


// --- Types
interface RegionSetContextType {
  trackRegionSetsMap: Map<string,TrackRegionSet[]>
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createRegionSet: (params: CreateRegionSetParams) => Promise<CreateRegionSetResult>
  updateRegionSet:(params:UpdateRegionSetParams)=>Promise<EditRegionSetResult>
  removeRegionSet: (params: RemoveRegionSetParams) => Promise<void>
  copyRegionSet:(params:CopyRegionSetParams)=>Promise<TrackRegionSet>

  createRegion(params: CreateRegionParams): Promise<TrackRegionSet>
  updateRegion(params: EditRegionParams): Promise<TrackRegionSet>
  removeRegion(params: RemoveRegionParams): Promise<TrackRegionSet>
  copyRegion(params:CopyRegionParams):Promise<TrackRegionSet>
}
interface RegionSetsProviderProps {
  children: ReactNode
}
// --- Context
// eslint-disable-next-line react-refresh/only-export-components
export const RegionSetsContext = createContext<RegionSetContextType | null>(null)

// --- Provider
export const RegionSetsProvider = ({ children }: RegionSetsProviderProps) => {
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

  const createRegion = async (params: CreateRegionParams): Promise<TrackRegionSet> => {
    const { region_set: updated } = await apiAddRegion(params); // already has the new region

    setTrackRegionSetsMap(prev => {
    const m = new Map(prev);
    const sets = m.get(updated.track_id) ?? [];

    const nextSets = sets.map(s =>
      s.id === updated.id ? updated : s
    );

    // if the array was empty (not loaded yet), insert it
    if (sets.length === 0) {
      m.set(updated.track_id, [updated]);
    } else {
      m.set(updated.track_id, nextSets);
    }
    return m;
  });

  return updated;
};

  const updateRegion = async (params: EditRegionParams): Promise<TrackRegionSet> => {
  const { region_set: updated } = await apiEditRegion(params);

  setTrackRegionSetsMap(prev => {
    const m = new Map(prev);
    const sets = m.get(updated.track_id) ?? [];

    // Find the exact RegionSet
    const idx = sets.findIndex(s => s.id === updated.id);
    if (idx === -1) return prev; // RegionSet not in state yet

    // Replace the whole RegionSet with the updated one from API
    const nextSets = [...sets];
    nextSets[idx] = updated;

    m.set(updated.track_id, nextSets);
    return m;
  });

  return updated;
};

  const removeRegion = async (params: RemoveRegionParams): Promise<TrackRegionSet> => {
  await apiRemoveRegion(params);

  setTrackRegionSetsMap(prev => {
    const m = new Map(prev);
    const trackSets = m.get(params.trackId) ?? [];

    const idx = trackSets.findIndex(s => s.id === params.regionSetId);
    if (idx === -1) return prev;
    
    const nextSets = [...trackSets];
    nextSets[idx] = updated; // updated set has one less region

    m.set(updated.track_id, nextSets);
    return m;
  });

  return updated;
};
  const copyRegion=async (params:CopyRegionParams):Promise<TrackRegionSet>=>{
    const result=await apiCopyRegion(params);
    return result.regionSet;
  }
  const createRegionSet = async (params: CreateRegionSetParams):Promise<CreateRegionSetResult>=> {
    console.log("inside add region set - context");
    const result=await apiCreateRegionSet(params)
    const updated=await apiGetRegionSetsForTrack(params.track_id);
    setTrackRegionSetsMap(prev=>{
        const newMap=new Map(prev);
        newMap.set(params.track_id,updated.sets);
        return newMap
    });
    return result
  }
  const updateRegionSet=async(params:UpdateRegionSetParams):Promise<EditRegionSetResult>=>{
    console.log("inside update region set before api request");
    const result=await apiUpdateRegionSet(params);
    setTrackRegionSetsMap(prev=>{
        const newMap=new Map(prev);
        const sets=newMap.get(params.trackId)??[];
        const updatedSets=sets.map(s=>s.id===params.region_set_id?{...s,...result.region_set}:s);
        newMap.set(params.trackId,updatedSets);
        return newMap
    });
    return result;
  }
  const removeRegionSet = async (params: RemoveRegionSetParams):Promise<void> => {
    const result=await apiRemoveRegionSet(params)
    await refresh();
    return result;
  }

  const copyRegionSet=async(params:CopyRegionSetParams):Promise<TrackRegionSet>=>{
    const result=await apiCopyRegionSet(params);
    await refresh();
    return result.region_set;
  }

  return (
    <RegionSetsContext.Provider value={{ 
        trackRegionSetsMap,
         loading,
          error,
           refresh, 
           createRegionSet,
           copyRegionSet,
           updateRegionSet, 
           removeRegionSet,
           removeRegion,
           createRegion,
           updateRegion,
           copyRegion
           }}>
      {children}
    </RegionSetsContext.Provider>
  )
}

// --- Hook
