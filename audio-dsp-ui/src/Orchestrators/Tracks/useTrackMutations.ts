// /src/Hooks/RegionSet/useRegionSetMutations.ts

import { useMutation, useQueryClient } from 'react-query';



import type { CreateRegionSetResult } from '@/Dtos/RegionSets/CreateRegionSetResult';
import type { NormalizedTrackRegionSet } from '@/Domain/RegionSet/NormalizedTrackRegionSet';
import type { AddTrackResult } from '@/Dtos/Tracks/AddTrackResult';
import type { AddTrackParams } from '@/Dtos/Tracks/AddTrackParams';
import { useTrackStore } from '@/Stores/TrackStore';
import { apiCopyTrack } from '@/Services/TracksService';
import type { CopyTrackParams } from '@/Dtos/Tracks/CopyTrackParams';

/**
 * Copy RegionSet Mutation
 * - Calls API to copy the entire tree
 * - Cascades normalization through all child stores
 * - Invalidates relevant queries
 */
export const useCopyTrack = () => {
  const queryClient = useQueryClient();
  const addRegionSet = useTrackStore(state => state.addTrack);

  return useMutation<AddTrackResult, Error, AddTrackParams>({
    mutationFn: (copySetParams: CopyTrackParams) => apiCopyTrack(copySetParams),
    
    onSuccess: (data: CreateRegionSetResult) => {
      // 1. Normalize the entire tree (cascades to Region, Graph, Nodes, Edges stores)
      const normalizedCopy = normalizeTr(data.region_set);
      
      // 2. Add the new copy to RegionSetStore
      addRegionSet(normalizedCopy);
      
      // 3. Invalidate queries to refresh UI
      // Invalidate the parent track's region sets list
      const trackId = normalizedCopy.track_id;
      queryClient.invalidateQueries(['regionSets', 'track', trackId]);
      
      // Optionally set the new data directly to avoid refetch
      queryClient.setQueryData(
        ['regionSet', normalizedCopy.id],
        normalizedCopy
      );
    },
    
    onError: (error: Error) => {
      console.error('Failed to copy region set:', error);
      // Could add toast notification here
    },
  });
};

/**
 * Delete RegionSet Mutation
 * - Calls API to delete
 * - Cascades deletion through all child stores
 * - Invalidates relevant queries
 */
export const useDeleteRegionSet = () => {
  const queryClient = useQueryClient();
  const getRegionSet = useRegionSetStore(state => state.getRegionSet);

  return useMutation<void, Error, RemoveRegionSetParams, { previousSet?: NormalizedTrackRegionSet }>(
    (removeSetParams: RemoveRegionSetParams) => apiRemoveRegionSet(removeSetParams),
    {
      // Optimistic update: remove from store immediately
      onMutate: async (removeSetParams: RemoveRegionSetParams) => {
        const setId = removeSetParams.region_set_id; // Adjust based on your params structure
        
        // Cancel outgoing refetches
        await queryClient.cancelQueries(['regionSet', setId]);
        
        // Snapshot the current value for rollback
        const previousSet = getRegionSet(setId);
        
        // Optimistically remove from all stores
        if (previousSet) {
          cascadeDeleteRegionSet(setId);
        }
        
        return { previousSet };
      },
      
      onSuccess: (_, removeSetParams, context) => {
        const setId = removeSetParams.region_set_id;
        
        // Invalidate parent track's region sets list
        if (context?.previousSet) {
          queryClient.invalidateQueries([
            'regionSets', 
            'track', 
            context.previousSet.track_id
          ]);
        }
        
        // Remove the individual query
        queryClient.removeQueries(['regionSet', setId]);
      },
      
      onError: (error: Error, removeSetParams, context) => {
        console.error('Failed to delete region set:', error);
        
        // Rollback: restore the entity if we have the snapshot
        if (context?.previousSet) {
          const addRegionSet = useRegionSetStore.getState().addRegionSet;
          addRegionSet(context.previousSet);
          
          // Also need to restore children - implement rollback cascade
          // For now, invalidate to refetch everything
          queryClient.invalidateQueries(['regionSet', removeSetParams.region_set_id]);
        }
      },
    }
  );
};

/**
 * Rename RegionSet Mutation (simpler example)
 */
export const useRenameRegionSet = () => {
  const queryClient = useQueryClient();
  const updateRegionSet = useRegionSetStore(state => state.updateRegionSet);

  return useMutation<
    void,
    Error,
    { setId: string; newName: string }
  >({
    mutationFn: async ({ setId, newName }) => {
      const response = await fetch(`/api/region-sets/${setId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to rename');
    },
    
    onMutate: async ({ setId, newName }) => {
      // Optimistic update
      updateRegionSet(setId, { name: newName });
    },
    
    onSuccess: (_, { setId }) => {
      queryClient.invalidateQueries(['regionSet', setId]);
    },
  });
};


