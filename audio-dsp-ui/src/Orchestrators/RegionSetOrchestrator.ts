import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  apiGetRegionSet,
  apiGetRegionSetsForTrack,
  apiCreateRegionSet,
  apiUpdateRegionSet,
  apiRemoveRegionSet,
  apiCopyRegionSet,
} from '@/Services/RegionSetsService';
import { useRegionSetStore } from '@/Stores/RegionSetStore';
import { useRegionStore } from '@/Stores/RegionStore';
import { useGraphStore } from '@/Stores/GraphStore';

// optional helper type for tree updates
import type { NormalizedTrackRegionSet } from '@/Domain/RegionSet/NormalizedTrackRegionSet';

export const useRegionSetOrchestrator = () => {
  const queryClient = useQueryClient();
  const { setAllRegionSets, addRegionSet, updateRegionSet, removeRegionSet } = useRegionSetStore();
  const { removeRegionsBySetId, addRegionsFromSet } = useRegionStore();
  const { removeGraphsBySetId, addGraphsFromSet } = useGraphStore();

  // ---------- QUERIES ----------
  const getRegionSetsForTrack = (trackId: string) => 
    useQuery({
      queryKey: ['regionSets', trackId],
      queryFn: () => apiGetRegionSetsForTrack(trackId),
      onSuccess: (data) => {
        // assume result: { region_sets: NormalizedTrackRegionSet[] }
        setAllRegionSets(data.region_sets);
      },
    });

  const getRegionSet = (setId: string) =>
    useQuery({
      queryKey: ['regionSet', setId],
      queryFn: () => apiGetRegionSet(setId),
      onSuccess: (data) => {
        addRegionSet(data);
      },
    });

  // ---------- MUTATIONS ----------
  const createRegionSet = useMutation({
    mutationFn: apiCreateRegionSet,
    onSuccess: (result) => {
      addRegionSet(result.region_set);
      queryClient.invalidateQueries({ queryKey: ['regionSets'] });
    },
  });

  const editRegionSet = useMutation({
    mutationFn: apiUpdateRegionSet,
    onSuccess: (result) => {
      updateRegionSet(result.region_set.id, result.region_set);
    },
  });

  const deleteRegionSet = useMutation({
    mutationFn: apiRemoveRegionSet,
    onSuccess: (_result, variables) => {
      const { region_set_id } = variables;
      // remove from all relevant stores
      removeRegionSet(region_set_id);
      removeRegionsBySetId(region_set_id);
      removeGraphsBySetId(region_set_id);
      queryClient.invalidateQueries({ queryKey: ['regionSets'] });
    },
  });

  const copyRegionSet = useMutation({
    mutationFn: apiCopyRegionSet,
    onSuccess: (result) => {
      // backend returns whole subtree (regionSet + regions + graphs)
      const newSet: NormalizedTrackRegionSet = result.region_set;
      addRegionSet(newSet);
      addRegionsFromSet(newSet);
      addGraphsFromSet(newSet);
      queryClient.invalidateQueries({ queryKey: ['regionSets'] });
    },
  });

  return {
    // queries
    getRegionSetsForTrack,
    getRegionSet,
    // mutations
    createRegionSet,
    editRegionSet,
    deleteRegionSet,
    copyRegionSet,
  };
};
