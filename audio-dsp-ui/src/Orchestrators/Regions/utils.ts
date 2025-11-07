import type { NormalizedTrackRegion } from "@/Domain/Region/NormalizedTrackRegion";
import type { TrackRegion } from "@/Domain/Region/TrackRegion";
import { useRegionStore } from "@/Stores/RegionStore";
import { cascadeDeleteGraph } from "../Graphs/utils";

export const normalizeRegion = (regionSetApi: TrackRegion): NormalizedTrackRegion => {
    // 🚨 Run the cascade to update all child stores and get the IDs for the index

    // Return the flat structure (Type 2)
    return {
        // Spread the intrinsic properties from the API model (Type 1)
        ...regionSetApi, 
        graphId:regionSetApi.graph?.id,
    } as NormalizedTrackRegion; 
};


export const cascadeDeleteRegion = (regionId: string): void => {
  const getRegion = useRegionStore.getState().getRegion;
  const removeRegion = useRegionStore.getState().removeRegion;
  
  const region = getRegion(regionId);
  if (!region) return;

  // If this region has a graph, cascade delete it
  if (region.graphId) {
    cascadeDeleteGraph(region.graphId); // This deletes Nodes and Edges
  }

  // Finally, remove the region itself
  removeRegion(regionId);
};

