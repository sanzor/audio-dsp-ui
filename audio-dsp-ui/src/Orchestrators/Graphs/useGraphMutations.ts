import { useMutation, useQueryClient } from "react-query";
import { apiCopyGraph } from "@/Services/GraphService";
import { useGraphStore } from "@/Stores/GraphStore";
import { normalizeGraph } from "./utils";
import type { CopyGraphParams } from "@/Dtos/Graphs/CopyGraphParams";
import type { CopyGraphResult } from "@/Dtos/Graphs/CopyGraphResult";

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
