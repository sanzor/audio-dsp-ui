import { useAuth } from "@/Auth/UseAuth";

import { useRegionStore } from "@/Stores/RegionStore";
import { useQuery } from "react-query";

import type { TrackRegion } from "@/Domain/Region/TrackRegion";
import type { NormalizedTrackRegion } from "@/Domain/Region/NormalizedTrackRegion";
import { normalizeRegion } from "@/Domain/Region/Mappers";
import { apiGetRegion, apiGetRegionsForRegionSet } from "@/Services/RegionsService";

export const useGetRegion = (regionId: string) => {
  const addRegionSet = useRegionStore(state => state.addRegion);
  const { user } = useAuth();

  return useQuery<TrackRegion, string, NormalizedTrackRegion | undefined>({
    queryKey: ['region', regionId],
    queryFn: () => apiGetRegion(regionId),
    enabled: !!regionId && !!user,

    select: (data) => data ? normalizeRegion(data) : undefined,

    onSuccess: (normalized) => {
      if (normalized) addRegionSet(normalized);
    },
  });
};

export const useGetRegionForRegionSet = (setId: string) => {
  const setAllRegionSets = useRegionStore(state => state.setAllRegions);
  const { user } = useAuth();

  return useQuery<TrackRegion[], string, NormalizedTrackRegion[]>({
    queryKey: ['regions', 'region-set', setId],
    queryFn: async () => {
      const response = await apiGetRegionsForRegionSet(setId);
      return response.regions;
    },
    enabled: !!setId && !!user,

    select: (regions) => regions.map(normalizeRegion),

    onSuccess: (normalizedList) => {
      setAllRegionSets(normalizedList);
    },
  });
};
