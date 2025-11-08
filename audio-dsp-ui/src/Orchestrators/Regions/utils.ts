import type { NormalizedTrackRegion } from "@/Domain/Region/NormalizedTrackRegion";
import type { TrackRegion } from "@/Domain/Region/TrackRegion";
import { useRegionStore } from "@/Stores/RegionStore";
import { useRegionSetStore } from "@/Stores/RegionSetStore";
import { useGraphStore } from "@/Stores/GraphStore";
import { cascadeDeleteGraph, normalizeGraph } from "../Graphs/utils";

type TrackRegionWithGraph = TrackRegion & {
  graph?: TrackRegion["graph"] & {
    nodes?: Array<{ id: string }>;
    edges?: Array<{ id: string }>;
  };
};

export const normalizeRegionWithCascade = (
  regionApi: TrackRegionWithGraph
): NormalizedTrackRegion => {
  const addGraph = useGraphStore.getState().addGraph;
  const { graph, ...rest } = regionApi;

  if (graph) {
    const normalizedGraph = normalizeGraph(graph);
    addGraph(normalizedGraph);
  }

  return {
    ...rest,
    graph: undefined,
    graphId: graph ? graph.id : null,
  };
};

export const cascadeDeleteRegion = (regionId: string): void => {
  const getRegion = useRegionStore.getState().getRegion;
  const removeRegion = useRegionStore.getState().removeRegion;
  const detachRegionFromSet = useRegionSetStore.getState().detachRegion;

  const region = getRegion(regionId);
  if (!region) return;

  if (region.graphId) {
    cascadeDeleteGraph(region.graphId);
  }

  detachRegionFromSet(region.region_set_id, regionId);
  removeRegion(regionId);
};
