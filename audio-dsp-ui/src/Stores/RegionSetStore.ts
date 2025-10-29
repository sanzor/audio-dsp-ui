// /src/Stores/useRegionSetStore.ts

import type { NormalizedTrackRegionSet } from '@/Domain/RegionSet/NormalizedTrackRegionSet';
import { create } from 'zustand';




// ----------------------------------------------------
// 1. Normalized State & Action Definitions
// ----------------------------------------------------

type RegionSetCache = Map<string, NormalizedTrackRegionSet>;

interface RegionSetState {
    regionSets: RegionSetCache;
    loading: boolean;
}

interface RegionSetActions {
    // CRUD Operations for the Set itself
    getRegionSet: (setId: string) => NormalizedTrackRegionSet | undefined;
    setAllRegionSets: (sets: NormalizedTrackRegionSet[]) => void;
    addRegionSet: (set: NormalizedTrackRegionSet) => void;
    removeRegionSet: (setId: string) => void;
    updateRegionSet: (setId: string, updates: Partial<NormalizedTrackRegionSet>) => void;
}

type RegionSetStore = RegionSetState & RegionSetActions;

// ----------------------------------------------------
// 2. Zustand Store Implementation
// ----------------------------------------------------

export const useRegionSetStore = create<RegionSetStore>((set, get) => ({
    regionSets: new Map(),
    loading: true,

    // --- CRUD ---

    setAllRegionSets: (newRegionSets) => {
        const setMap = new Map<string, NormalizedTrackRegionSet>(); 
        newRegionSets.forEach(s => setMap.set(s.id, s));
        set({ regionSets: setMap, loading: false });
    },

    getRegionSet: (setId) => {
        return get().regionSets.get(setId);
    },

    addRegionSet: (setToAdd) => set((state) => {
        const newMap = new Map(state.regionSets); 
        newMap.set(setToAdd.id, setToAdd); 
        return { regionSets: newMap };
    }),

    removeRegionSet: (setId) => set((state) => {
        const newMap = new Map(state.regionSets); 
        newMap.delete(setId); 
        return { regionSets: newMap };
    }),

    updateRegionSet: (setId, updates) => set((state) => {
        const setEntity = state.regionSets.get(setId);
        if (!setEntity) return state;

        const newMap = new Map(state.regionSets);
        newMap.set(setId, { ...setEntity, ...updates });
        return { regionSets: newMap };
    }),
    
    // --- Relationship Management ---

    // addRegionId: (setId, regionId) => set((state) => {
    //     const setEntity = state.regionSets.get(setId);
    //     if (!setEntity) return state;

    //     const newMap = new Map(state.regionSets);
    //     newMap.set(setId, {
    //         ...setEntity,
    //         // Add the new ID to the existing array, ensuring uniqueness if necessary
    //         region_ids: [...setEntity.region_ids, regionId],
    //     } as NormalizedRegionSet); // Cast may be needed if TS complains about merging TrackRegionSet
        
    //     return { regionSets: newMap };
    // }),
    
    // removeRegionId: (setId, regionId) => set((state) => {
    //     const setEntity = state.regionSets.get(setId);
    //     if (!setEntity) return state;

    //     const newRegionIds = setEntity.region_ids.filter(id => id !== regionId);

    //     const newMap = new Map(state.regionSets);
    //     newMap.set(setId, {
    //         ...setEntity,
    //         region_ids: newRegionIds,
    //     } as NormalizedRegionSet);
        
    //     return { regionSets: newMap };
    // }),
}));