import { useAuth } from "@/Auth/UseAuth";
import type { NormalizedTrackRegionSet } from "@/Domain/RegionSet/NormalizedTrackRegionSet";
import type { TrackRegionSet } from "@/Domain/RegionSet/TrackRegionSet";
import { apiGetRegionSet, apiGetRegionSetsForTrack } from "@/Services/RegionSetsService";
import { useRegionSetStore } from "@/Stores/RegionSetStore";
import { useQuery } from "react-query";
import { normalizeRegionSet } from "./utils";

export const useGetRegionSet = (regionSetId: string) => {
  const addRegionSet = useRegionSetStore(state => state.addRegionSet);
  const { user } = useAuth();

  return useQuery<TrackRegionSet, string, NormalizedTrackRegionSet | undefined>({
    queryKey: ['regionSet', regionSetId],
    queryFn: () => apiGetRegionSet(regionSetId),
    enabled: !!regionSetId && !!user,

    select: (data) => data ? normalizeRegionSet(data) : undefined,

    onSuccess: (normalized) => {
      if (normalized) addRegionSet(normalized);
    },
  });
};

export const useGetAllRegionSetsForTrack = (trackId: string) => {
  const setAllRegionSets = useRegionSetStore(state => state.setAllRegionSets);
  const { user } = useAuth();

  return useQuery<TrackRegionSet[], string, NormalizedTrackRegionSet[]>({
    queryKey: ['regionSets', 'track', trackId],
    queryFn: async () => {
      const response = await apiGetRegionSetsForTrack(trackId);
      return response.sets;
    },
    enabled: !!trackId && !!user,

    select: (regionSets) => regionSets.map(normalizeRegionSet),

    onSuccess: (normalizedList) => {
      setAllRegionSets(normalizedList);
    },
  });
};
