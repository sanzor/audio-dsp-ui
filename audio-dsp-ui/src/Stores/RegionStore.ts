
import type { NormalizedTrackRegion } from '@/Domain/Region/NormalizedTrackRegion';
import type { TrackRegion } from '@/Domain/Region/TrackRegion';
import {create} from 'zustand'

type RegionCache=Map<string,NormalizedTrackRegion>;
interface RegionState{
    regions:RegionCache,
    loading:boolean
}
interface TrackActions{
    getRegion:(regionId:string)=>NormalizedTrackRegion|undefined;
    addRegion:(region:NormalizedTrackRegion)=>void;
    removeRegion:(regionId:string)=>void;
    updateRegion:(regionId:string,region:Partial<NormalizedTrackRegion>)=>void
    setAllRegions:(regions:[NormalizedTrackRegion])=>void

}

type RegionStore=RegionState & TrackActions;

export const useTrackStore = create<RegionStore>((set, get) => ({
    regions: new Map(),
    loading: true,

    // --- Already implemented ---
    setAllRegions: (newRegions) => {
        const regionMap = new Map<string, NormalizedTrackRegion>(); 
        newRegions.forEach(t => regionMap.set(t.region_id, t));
        set({ 
            regions: regionMap, 
            loading: false 
        });
    },

    // ----------------------------------------------------
    // ✅ getTrack: Use the 'get' function to read state.
    // ----------------------------------------------------
    getRegion: (regionId: string): NormalizedTrackRegion | undefined => {
        // Use the 'get()' function to synchronously retrieve the current state
        return get().regions.get(regionId);
    },

    // ----------------------------------------------------
    // ✅ addTrack: Update the state immutably using 'set'.
    // ----------------------------------------------------
    addRegion: (region: NormalizedTrackRegion): void => {
        set((state) => {
            // 1. Create a new Map based on the current tracks
            const newMap = new Map(state.regions); 
            // 2. Add the new track
            newMap.set(region.region_id, region); 
            // 3. Return the new state object with the updated map
            return { regions: newMap };
        });
    },

    // ----------------------------------------------------
    // ✅ removeTrack: Update the state immutably using 'set'.
    // ----------------------------------------------------
    removeRegion: (regionId: string): void => {
        set((state) => {
            // 1. Create a new Map based on the current tracks
            const newMap = new Map(state.regions); 
            // 2. Delete the track by ID
            newMap.delete(regionId); 
            // 3. Return the new state object
            return { regions: newMap };
        });
    },

    // ----------------------------------------------------
    // ✅ updateTrack: Update a property on a single track.
    // ----------------------------------------------------
    // Assuming updateTrack takes the ID and the new partial data/properties to merge
    // This example assumes TrackActions interface was: updateTrack(trackId: string, updates: Partial<TrackMeta>): void
    updateRegion: (regionId: string, updates: Partial<TrackRegion>): void => {
        set((state) => {
            const trackToUpdate = state.regions.get(regionId);
            if (!trackToUpdate) return state; // Guard against missing track

            // 1. Create a new Map
            const newMap = new Map(state.regions);
            
            // 2. Create a new, updated track object and set it in the new Map
            newMap.set(regionId, { 
                ...trackToUpdate, 
                ...updates 
            });

            // 3. Return the new state object
            return { regions: newMap };
        });
    },
}));