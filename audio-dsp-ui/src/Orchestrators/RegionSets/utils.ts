import type { NormalizedTrackRegionSet } from "@/Domain/RegionSet/NormalizedTrackRegionSet";
import type { TrackRegionSet } from "@/Domain/RegionSet/TrackRegionSet";
import { cascadeDeleteRegion, normalizeRegion } from "../Regions/utils";
import { useRegionStore } from "@/Stores/RegionStore";
import { useRegionSetStore } from "@/Stores/RegionSetStore";


/**
 * Cascade normalization: Updates all child stores and returns the normalized parent
 */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { regions, ...rest } = regionSetApi;
  return {
    ...rest,
    region_ids: regionIds,
  };
}

export const cascadeDeleteRegionSet = (setId: string): void => {
  // 1. Get store accessors (using .getState() because we're outside React)
  const getRegionSet = useRegionSetStore.getState().getRegionSet;
  const removeRegionSet = useRegionSetStore.getState().removeRegionSet;

  // 2. Get the entity to find its children
  const regionSet = getRegionSet(setId);
  if (!regionSet) return; // Already deleted or doesn't exist

  // 3. CASCADE DOWN: Delete all child regions first
  //    Each child deletion will cascade further (Region → Graph → Nodes/Edges)
  for (const regionId of regionSet.region_ids) {
    cascadeDeleteRegion(regionId); // This recursively deletes Graph, Nodes, Edges
  }

  // 4. DELETE PARENT: Finally, remove this RegionSet from its store
  removeRegionSet(setId);
};