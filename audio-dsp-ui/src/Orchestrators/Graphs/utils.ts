import type { Graph } from "@/Domain/Graph/Graph";
import type { NormalizedGraph } from "@/Domain/Graph/NormalizedGraph";
import { useGraphStore } from "@/Stores/GraphStore";

type GraphWithChildren = Graph & {
  nodes?: Array<{ id: string }>;
  edges?: Array<{ id: string }>;
};

export const normalizeGraph = (graphApi: GraphWithChildren): NormalizedGraph => {
  const { nodes, edges, ...rest } = graphApi;

  return {
    ...rest,
    nodes_ids: nodes?.map(node => node.id) ?? [],
    edges_ids: edges?.map(edge => edge.id) ?? [],
  };
};

export const cascadeDeleteGraph = (graphId: string): void => {
  const removeGraph = useGraphStore.getState().removeGraph;
  removeGraph(graphId);
  // When dedicated node/edge stores exist, cascade their deletion here.
};
