import { useAuth } from "@/Auth/UseAuth";
import type { Graph } from "@/Domain/Graph/Graph";
import type { NormalizedGraph } from "@/Domain/Graph/NormalizedGraph";
import { apiGetGraph } from "@/Services/GraphService";
import { useGraphStore } from "@/Stores/GraphStore";
import { useQuery } from "react-query";

const normalizeGraph = (graphApi: Graph): NormalizedGraph => {
    // NOTE: This assumes Graph API model includes nested nodes/edges arrays.
    return {
        ...graphApi,
        nodes_ids: graphApi.nodes ? graphApi.nodes.map(n => n.id) : [], 
        edges_ids: graphApi.edges ? graphApi.edges.map(e => e.id) : [],
    } as NormalizedGraph; 
};


export const useGetGraph = (graphId: string) => {
    // 1. Get necessary state and mutator from the Zustand store
    const addGraph = useGraphStore(state => state.addGraph);
    const cachedGraph = useGraphStore(state => state.getGraph(graphId));
    const { user } = useAuth();
    
    // We rely on React Query's built-in caching and refetch logic.
    // If 'cachedGraph' exists, the query will only run in the background if the cache time is expired.
    // However, if we rely ONLY on React Query's cache, we simplify the logic here:

    return useQuery<Graph, string, NormalizedGraph | undefined, string[]>({
        queryKey: ['graph', graphId],
        queryFn: () => apiGetGraph(graphId),
        
        enabled: !!graphId && !!user,
        
        // FIX: The type signature is forcing onSuccess to accept TData. 
        // We need to use the data *before* the select transformation for the store update.
        // Let's use the explicit signature to make onSuccess accept the raw data type (Graph).
        
        // To force onSuccess to use the TQueryFnData (Graph) type:
        // We cast the options object to ensure the type checker is satisfied.
        // NOTE: This approach is often required when using both select and onSuccess.
        
        onSuccess: (graphApi) => {
             // TypeScript can infer graphApi is Graph because it's the raw data type (TQueryFnData)
             // This is the cleanest approach, but sometimes requires the full generic
             // signature to align correctly.
             const normalizedGraph = normalizeGraph(graphApi);
             addGraph(normalizedGraph); 
        },

        initialData: cachedGraph,

        // Data that leaves the hook is NormalizedGraph | undefined
        select: (data) => data ? normalizeGraph(data) : cachedGraph,
    });
};