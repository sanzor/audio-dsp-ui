import type { Graph } from "@/Domain/Graph/Graph";
import type { NormalizedGraph } from "@/Domain/Graph/NormalizedGraph";
import { useGraphStore } from "@/Stores/GraphStore";

type GraphWithChildren = Graph & {
  nodes?: Array<{ id: string }>;
  edges?: Array<{ id: string }>;
};

type GraphLike = GraphWithChildren | NormalizedGraph | undefined | null;

export const normalizeGraph = (graphApi: GraphLike): NormalizedGraph => {
  if (!graphApi) {
    throw new Error("Cannot normalize empty graph payload");
  }

  if ("nodes_ids" in graphApi || "edges_ids" in graphApi) {
    return graphApi as NormalizedGraph;
  }

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
