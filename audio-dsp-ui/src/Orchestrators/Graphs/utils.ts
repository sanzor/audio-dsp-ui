import { useGraphStore } from "@/Stores/GraphStore";

export const cascadeDeleteGraph = (graphId: string): void => {
  const getGraph = useGraphStore.getState().getGraph;
  const removeGraph = useGraphStore.getState().removeGraph;
  
  const graph = getGraph(graphId);
  if (!graph) return;

  // If this region has a graph, cascade delete it
  if (graph.graphId) {
    cascadeDeleteGraph(graph.graphId); // This deletes Nodes and Edges
  }

  // Finally, remove the region itself
  removeGraph(graphId);
};