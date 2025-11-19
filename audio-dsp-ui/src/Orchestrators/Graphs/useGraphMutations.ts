import { useMutation, useQueryClient } from "react-query";
import { apiCopyGraph } from "@/Services/GraphService";
import { useGraphStore } from "@/Stores/GraphStore";
import { normalizeGraph } from "./utils";
import type { CopyGraphParams } from "@/Dtos/Graphs/CopyGraphParams";
import type { CopyGraphResult } from "@/Dtos/Graphs/CopyGraphResult";
import { useRegionStore } from "@/Stores/RegionStore";

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


export const useCreateGraph = () => {
  const addRegion=useGraphStore(state=>state.addGraph);
  const attachGraph=useRegionStore(state=>state.att);
  return useMutation<CreateRegionResult, Error, CreateRegionParams>({
    mutationFn: (params) => apiAddRegion(params),
    onSuccess: (data) => {
      //update region set , attach region
      const region=data.region;
      const normalizedRegion=normalizeRegionWithCascade(region);
      addRegion(normalizedRegion);
      attachRegion(region.region_set_id,region.region_id);
    },
    onError: (error) => {
      console.error('Failed to create region', error);
    },
  });
};

