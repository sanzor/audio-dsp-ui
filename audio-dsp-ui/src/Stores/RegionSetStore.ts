// /src/Stores/useRegionSetStore.ts

import type { NormalizedTrackRegionSet } from '@/Domain/RegionSet/NormalizedTrackRegionSet';
import { create } from 'zustand';

type RegionSetCache = Map<string, NormalizedTrackRegionSet>;

interface RegionSetState {
    regionSets: RegionSetCache;
    loading: boolean;
}

interface RegionSetActions {
    getRegionSet: (setId: string) => NormalizedTrackRegionSet | undefined;
    setAllRegionSets: (sets: NormalizedTrackRegionSet[]) => void;
    addRegionSet: (set: NormalizedTrackRegionSet) => void;
    removeRegionSet: (setId: string) => void;
    updateRegionSet: (setId: string, updates: Partial<NormalizedTrackRegionSet>) => void;
    attachRegion: (setId: string, regionId: string) => void;
    detachRegion: (setId: string, regionId: string) => void;
}

type RegionSetStore = RegionSetState & RegionSetActions;

const updateRegionIds = (
    entity: NormalizedTrackRegionSet,
    updater: (regionIds: string[]) => string[]
): NormalizedTrackRegionSet => ({
    ...entity,
    region_ids: updater(entity.region_ids ?? []),
});

export const useRegionSetStore = create<RegionSetStore>((set, get) => ({
    regionSets: new Map(),
    loading: true,

    setAllRegionSets: (newRegionSets) => {
        const setMap = new Map<string, NormalizedTrackRegionSet>();
        newRegionSets.forEach((s) => setMap.set(s.id, s));
        set({ regionSets: setMap, loading: false });
    },

    getRegionSet: (setId) => get().regionSets.get(setId),

    addRegionSet: (setToAdd) =>
        set((state) => {
            const newMap = new Map(state.regionSets);
            newMap.set(setToAdd.id, setToAdd);
            return { regionSets: newMap };
        }),

    removeRegionSet: (setId) =>
        set((state) => {
            const newMap = new Map(state.regionSets);
            newMap.delete(setId);
            return { regionSets: newMap };
        }),

    updateRegionSet: (setId, updates) =>
        set((state) => {
            const setEntity = state.regionSets.get(setId);
            if (!setEntity) return state;

            const newMap = new Map(state.regionSets);
            newMap.set(setId, { ...setEntity, ...updates });
            return { regionSets: newMap };
        }),

    attachRegion: (setId, regionId) =>
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

    detachRegion: (setId, regionId) =>
        set((state) => {
            const setEntity = state.regionSets.get(setId);
            if (!setEntity) return state;

            const updated = updateRegionIds(setEntity, (ids) => ids.filter((id) => id !== regionId));

            const newMap = new Map(state.regionSets);
            newMap.set(setId, updated);
            return { regionSets: newMap };
        }),
}));
