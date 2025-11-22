import { useMutation, useQueryClient } from "react-query";
import { apiCopyGraph, apiCreateGraph } from "@/Services/GraphService";
import { useGraphStore } from "@/Stores/GraphStore";
import { normalizeGraph } from "./utils";
import type { CopyGraphParams } from "@/Dtos/Graphs/CopyGraphParams";
import type { CopyGraphResult } from "@/Dtos/Graphs/CopyGraphResult";
import { useRegionStore } from "@/Stores/RegionStore";
import type { CreateGraphParams } from "@/Dtos/Graphs/CreateGraphParams";
import type { CreateGraphResult } from "@/Dtos/Graphs/CreateGraphResult";

export const useCreateGraph = () => {
  const addGraph=useGraphStore(state=>state.addGraph);
  const attachGraph=useRegionStore(state=>state.attachGraph);
  return useMutation<CreateGraphResult, Error, CreateGraphParams>({
    mutationFn: (params) => apiCreateGraph(params),
    onSuccess: (data) => {
      //update region set , attach region
      const graph=data.graph;
      const normalizedGraph=normalizeGraph(graph);
      addGraph(normalizedGraph);
      attachGraph(normalizedGraph.regionId,normalizedGraph.id);
    },
    onError: (error) => {
      console.error('Failed to create region', error);
    },
  });
};


export const useCopyGraph = () => {
  const queryClient = useQueryClient();
  const addGraph = useGraphStore(state => state.addGraph);

  return useMutation<CopyGraphResult, Error, CopyGraphParams>({
    mutationFn: params => apiCopyGraph(params),
    onSuccess: (data) => {
      const normalized = normalizeGraph(data.graph);
      addGraph(normalized);
      queryClient.invalidateQueries(['graph', normalized.id]);
    },
    onError: (error) => {
      console.error("Failed to copy graph", error);
    },
  });
};



