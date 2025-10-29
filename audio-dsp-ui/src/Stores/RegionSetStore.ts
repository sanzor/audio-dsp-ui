// /src/Stores/useRegionSetStore.ts

import { create } from 'zustand';

import type { TrackRegionSet } from '@/Domain/RegionSet/TrackRegionSet'; 


// ----------------------------------------------------
// 1. Normalized State & Action Definitions
// ----------------------------------------------------

// The local entity representation, holding necessary foreign keys
export interface NormalizedRegionSet extends TrackRegionSet { 
    track_id: string;      // Reference to the parent Track
    region_ids: string[]; // References to child Regions
}

type RegionSetCache = Map<string, NormalizedRegionSet>;

interface RegionSetState {
    regionSets: RegionSetCache;
    loading: boolean;
}

interface RegionSetActions {
    // CRUD Operations for the Set itself
    getRegionSet: (setId: string) => NormalizedRegionSet | undefined;
    setAllRegionSets: (sets: NormalizedRegionSet[]) => void;
    addRegionSet: (set: NormalizedRegionSet) => void;
    removeRegionSet: (setId: string) => void;
    updateRegionSet: (setId: string, updates: Partial<NormalizedRegionSet>) => void;
}

type RegionSetStore = RegionSetState & RegionSetActions;

// ----------------------------------------------------
// 2. Zustand Store Implementation
// ----------------------------------------------------

export const useRegionSetStore = create<RegionSetStore>((set, get) => ({
    regionSets: new Map(),
    loading: true,

    // --- CRUD ---

    setAllRegionSets: (newSets) => {
        const setMap = new Map<string, NormalizedRegionSet>(); 
        newSets.forEach(s => setMap.set(s.id, s));
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