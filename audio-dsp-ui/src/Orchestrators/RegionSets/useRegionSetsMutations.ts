// /src/Hooks/RegionSet/useRegionSetMutations.ts

import { useMutation, useQueryClient } from 'react-query';
import { useRegionSetStore } from '@/Stores/RegionSetStore';

import type { CopyRegionSetParams } from '@/Dtos/RegionSets/CoyRegionSetParams';
import type { RemoveRegionSetParams } from '@/Dtos/RegionSets/RemoveRegionSetParams';
import { apiCopyRegionSet, apiRemoveRegionSet } from '@/Services/RegionSetsService';
import { normalizeRegionSetWithCascade } from './utils';
import type { CreateRegionSetResult } from '@/Dtos/RegionSets/CreateRegionSetResult';

/**
 * Copy RegionSet Mutation
 * - Calls API to copy the entire tree
 * - Cascades normalization through all child stores
 * - Invalidates relevant queries
 */
export const useCopyRegionSet = () => {
  const queryClient = useQueryClient();
  const addRegionSet = useRegionSetStore(state => state.addRegionSet);

  return useMutation<CreateRegionSetResult, Error, CopyRegionSetParams>({
    mutationFn: (copySetParams: CopyRegionSetParams) => apiCopyRegionSet(copySetParams),
    
    onSuccess: (data: CreateRegionSetResult) => {
      // 1. Normalize the entire tree (cascades to Region, Graph, Nodes, Edges stores)
      const normalizedCopy = normalizeRegionSetWithCascade(data.region_set);
      
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

  return useMutation<void, Error, RemoveRegionSetParams>({
    mutationFn: (removeSetParams: RemoveRegionSetParams) => apiRemoveRegionSet(removeSetParams),
    
    // Optimistic update: remove from store immediately
    onMutate: async (removeSetParams: RemoveRegionSetParams) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['regionSet', removeSetParams]);
      
      // Snapshot the current value for rollback
      const previousSet = getRegionSet(removeSetParams.region_set_id);
      
      // Optimistically remove from all stores
      cascadeDeleteRegionSet(removeSetParams);
      
      return { previousSet };
    },
    
    onSuccess: (_, setId) => {
      // Invalidate parent track's region sets list
      const previousSet = getRegionSet(setId);
      if (previousSet) {
        queryClient.invalidateQueries([
          'regionSets', 
          'track', 
          previousSet.track_id
        ]);
      }
      
      // Remove the individual query
      queryClient.removeQueries(['regionSet', setId]);
    },
    
    onError: (error: Error, setId, context) => {
      console.error('Failed to delete region set:', error);
      
      // Rollback: restore the entity if we have the snapshot
      if (context?.previousSet) {
        // You would need to implement rollback cascade here
        // For now, just invalidate to refetch
        queryClient.invalidateQueries(['regionSet', setId]);
      }
    },
  });
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