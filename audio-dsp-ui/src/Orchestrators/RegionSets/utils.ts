import type { NormalizedTrackRegionSet } from "@/Domain/RegionSet/NormalizedTrackRegionSet";
import type { TrackRegionSet } from "@/Domain/RegionSet/TrackRegionSet";
import { normalizeRegion } from "../Regions/utils";
import { useRegionStore } from "@/Stores/RegionStore";
import { useRegionSetStore } from "@/Stores/RegionSetStore";


export const normalizeRegionSetWithCascade = (
  regionSetApi: TrackRegionSet
): NormalizedTrackRegionSet => {
  const regionIds: string[] = [];
  const addRegion = useRegionStore.getState().addRegion;

  // Cascade to children: normalize each region and update RegionStore
  for (const regionApi of regionSetApi.regions) {
    // normalizeRegion handles its own cascade (Graph -> Nodes/Edges)
    const normalizedRegion = normalizeRegion(regionApi);
    
    // Update the child store
    addRegion(normalizedRegion);
    regionIds.push(regionApi.region_id);
  }

  // Return the normalized parent with child IDs
  const { regions, ...rest } = regionSetApi;
  return {
    ...rest,
    region_ids: regionIds,
  };
};

export const cascadeDeleteRegionSet = (setId: string): void => {
  const getRegionSet = useRegionSetStore.getState().getRegionSet;
  const removeRegion = useRegionStore.getState().removeRegion;
  const removeRegionSet = useRegionSetStore.getState().removeRegionSet;

  // Get the entity before deletion
  const regionSet = getRegionSet(setId);
  if (!regionSet) return;

  // Cascade delete all child regions (which will cascade to graphs, etc.)
  for (const regionId of regionSet.region_ids) {
    // Assume cascadeDeleteRegion handles Graph -> Nodes/Edges
    cascadeDeleteRegion(regionId);
  }

  // Finally, remove the parent
  removeRegionSet(setId);
};