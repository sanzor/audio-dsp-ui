
import { normalizeRegion } from '@/Domain/Region/Mappers';
import type { NormalizedTrackRegion } from '@/Domain/Region/NormalizedTrackRegion';
import type { TrackRegionSetViewModel } from '@/Domain/RegionSet/TrackRegionSetViewModel';
import { create } from 'zustand';

type RegionCache = Map<string, NormalizedTrackRegion>;

interface RegionState {
    regions: RegionCache;
    loading: boolean;
}

interface TrackActions {
    getRegion: (regionId: string) => NormalizedTrackRegion | undefined;
    addRegion: (region: NormalizedTrackRegion) => void;
    attachGraph: (setId: string, regionId: string,graphId:string) => void;
    detachGraph: (setId: string, regionId: string,graphId:string) => void;
    removeRegion: (regionId: string) => void;
    updateRegion: (regionId: string, region: Partial<NormalizedTrackRegion>) => void;
    setAllRegions: (regions: NormalizedTrackRegion[]) => void;
    removeRegionsBySetId: (setId: string) => void;
    addRegionsFromSet: (set: TrackRegionSetViewModel) => void;
}

type RegionStore = RegionState & TrackActions;

export const useRegionStore = create<RegionStore>((set, get) => ({
    regions: new Map(),
    loading: true,

    setAllRegions: (newRegions) => {
        const regionMap = new Map<string, NormalizedTrackRegion>();
        newRegions.forEach((t) => regionMap.set(t.region_id, t));
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
            newMap.set(region.region_id, region);
            return { regions: newMap };
        });
    },

    addRegionsFromSet: (regionSet: TrackRegionSetViewModel): void => {
        set((state) => {
            const newMap = new Map(state.regions);
            for (const region of regionSet.regions) {
                const normalizedRegion = normalizeRegion(region);
                newMap.set(region.region_id, normalizedRegion);
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
                if (value.region_set_id === setId) {
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
