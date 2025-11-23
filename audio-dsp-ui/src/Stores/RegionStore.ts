

import type { NormalizedTrackRegion } from '@/Domain/Region/NormalizedTrackRegion';
import type { TrackRegionSetViewModel } from '@/Domain/RegionSet/TrackRegionSetViewModel';
import { create } from 'zustand';

type RegionCache = Map<string, NormalizedTrackRegion>;

interface RegionState {
    regions: RegionCache;
    loading: boolean;
}

interface RegionActions {
    getRegion: (regionId: string) => NormalizedTrackRegion | undefined;
    addRegion: (region: NormalizedTrackRegion) => void;
    attachGraph: (regionId: string,graphId:string) => void;
    detachGraph: (regionId: string,graphId:string) => void;
    removeRegion: (regionId: string) => void;
    updateRegion: (regionId: string, region: Partial<NormalizedTrackRegion>) => void;
    setAllRegions: (regions: NormalizedTrackRegion[]) => void;
    removeRegionsBySetId: (setId: string) => void;
    addRegionsFromSet: (set: TrackRegionSetViewModel) => void;
}

type RegionStore = RegionState & RegionActions;

export const useRegionStore = create<RegionStore>((set, get) => ({
    regions: new Map(),
    loading: true,

    setAllRegions: (newRegions) => {
        const regionMap = new Map<string, NormalizedTrackRegion>();
        newRegions.forEach((t) => regionMap.set(t.regionId, t));
        set({
            regions: regionMap,
            loading: false,
        });
    },

    getRegion: (regionId: string): NormalizedTrackRegion | undefined => {
        return get().regions.get(regionId);
    },

    addRegion: (region: NormalizedTrackRegion): void => {
        set((state) => {
            const newMap = new Map(state.regions);
            newMap.set(region.regionId, region);
            return { regions: newMap };
        });
    },  

    addRegionsFromSet: (regionSet: TrackRegionSetViewModel): void => {
        set((state) => {
            const newMap = new Map(state.regions);
            for (const region of regionSet.regions) {
                
                newMap.set(region.regionId, region);
            }
            return { regions: newMap };
        });
    },

    removeRegion: (regionId: string): void => {
        set((state) => {
            const newMap = new Map(state.regions);
            newMap.delete(regionId);
            return { regions: newMap };
        });
    },

    removeRegionsBySetId: (setId: string): void => {
        set((state) => {
            const newMap = new Map(state.regions);
            for (const [key, value] of newMap) {
                if (value.regionSetId === setId) {
                    newMap.delete(key);
                }
            }
            return { regions: newMap };
        });
    },

    updateRegion: (regionId: string, updates: Partial<NormalizedTrackRegion>): void => {
        set((state) => {
            const trackToUpdate = state.regions.get(regionId);
            if (!trackToUpdate) return state;

            const newMap = new Map(state.regions);
            newMap.set(regionId, {
                ...trackToUpdate,
                ...updates,
            });

            return { regions: newMap };
        });
    },
    attachGraph: (setId, regionId,graphId) =>
        set((state) => {
            const setEntity = state.regionSets.get(setId);
            if (!setEntity) return state;

            const updated = updateRegionIds(setEntity, (ids) =>
                ids.includes(regionId) ? ids : [...ids, regionId]
            );

            const newMap = new Map(state.regionSets);
            newMap.set(setId, updated);
            return { regionSets: newMap };
        }),

    detachGraph: (setId, regionId,graphId) =>
        set((state) => {
            const setEntity = state.regionSets.get(setId);
            if (!setEntity) return state;

            const updated = updateRegionIds(setEntity, (ids) => ids.filter((id) => id !== regionId));

            const newMap = new Map(state.regionSets);
            newMap.set(setId, updated);
            return { regionSets: newMap };
        }),
}));
