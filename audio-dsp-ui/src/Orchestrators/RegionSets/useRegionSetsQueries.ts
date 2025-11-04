import { useAuth } from "@/Auth/UseAuth";
import type { NormalizedTrackRegionSet } from "@/Domain/RegionSet/NormalizedTrackRegionSet";
import type { TrackRegionSet } from "@/Domain/RegionSet/TrackRegionSet";
import { apiGetRegionSet } from "@/Services/RegionSetsService";
import { useRegionSetStore } from "@/Stores/RegionSetStore";
import { useQuery } from "react-query";
import { normalizeRegionSet } from "./utils";



export const useGetRegionSet = (regionSetId: string) => {
    const addRegionSet = useRegionSetStore(state => state.addRegionSet);

    // 🚨 FIX 1: Get cache from the correct store (RegionSetStore), 
    // and use the correct accessor (getRegionSet).
    const cachedRegionSet = useRegionSetStore(state => state.getRegionSet(regionSetId)); 
    const { user } = useAuth();

    // The generic types specify:
    // TQueryFnData: TrackRegionSet (Raw API data)
    // TError: string
    // TData: NormalizedTrackRegionSet | undefined (Data returned after 'select')
    // TQueryKey: string[]
    return useQuery<TrackRegionSet, string, NormalizedTrackRegionSet | undefined, string[]>({
        queryKey: ['regionSet', regionSetId],
        queryFn: () => apiGetRegionSet(regionSetId),
        
        enabled: !!regionSetId && !!user,
        
        // 🚨 FIX 2: onSuccess should accept the TQueryFnData type (TrackRegionSet).
        // React Query allows this when select is also present.
        onSuccess: (regionSetApi: TrackRegionSet) => {
             // 1. Orchestration: Normalize the data and update all child stores (cascade)
             const normalizedSet = normalizeRegionSet(regionSetApi);
             
             // 2. Update the current entity's store (RegionSetStore)
             addRegionSet(normalizedSet); 
        },

        initialData: cachedRegionSet,

        // Data leaving the hook is the Normalized Model (Type 2)
        select: (data) => data ? normalizeRegionSet(data) : cachedRegionSet,
    });
};