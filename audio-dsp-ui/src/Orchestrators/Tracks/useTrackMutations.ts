import { useMutation, useQueryClient } from 'react-query';
import { useTrackStore } from '@/Stores/TrackStore';
import type { CopyTrackParams } from '@/Dtos/Tracks/CopyTrackParams';
import type { CopyTrackResult } from '@/Dtos/Tracks/CopyTrackResult';
import type { RemoveTrackParams } from '@/Dtos/Tracks/RemoveTrackParams';
import type { RemoveTrackResult } from '@/Dtos/Tracks/RemoveTrackResult';
import type { NormalizedTrackMeta } from '@/Domain/Track/NormalizedTrackMeta';
import { apiCopyTrack, apiRemoveTrack } from '@/Services/TracksService';
import { normalizeTrackWithCascade, cascadeDeleteTrack } from './utils';

/**
 * Copy Track Mutation
 * - Calls API to copy the entire tree
 * - Cascades normalization through all child stores
 * - Invalidates relevant queries
 */
export const useCopyTrack = () => {
  const queryClient = useQueryClient();
  const addTrack = useTrackStore(state => state.addTrack);

  // ✅ FIX: Correct types - CopyTrackResult and CopyTrackParams
  return useMutation<CopyTrackResult, Error, CopyTrackParams>(
    (copyParams: CopyTrackParams) => apiCopyTrack(copyParams),
    {
      onSuccess: (data: CopyTrackResult) => {
        // 1. Normalize the entire tree (cascades to RegionSet, Region, Graph, Nodes, Edges stores)
        const normalizedCopy = normalizeTrackWithCascade(data.track);
        
        // 2. Add the new copy to TrackStore
        addTrack(normalizedCopy);
        
        // 3. Invalidate queries to refresh UI
        queryClient.invalidateQueries(['tracks']);
        
        // Optionally set the new data directly to avoid refetch
        queryClient.setQueryData(
          ['track', normalizedCopy.trackId],
          normalizedCopy
        );
      },
      
      onError: (error: Error) => {
        console.error('Failed to copy track:', error);
        // Could add toast notification here
      },
    }
  );
};

/**
 * Delete Track Mutation
 * - Calls API to delete
 * - Cascades deletion through all child stores
 * - Invalidates relevant queries
 */
export const useDeleteTrack = () => {
  const queryClient = useQueryClient();
  const getTrack = useTrackStore(state => state.getTrack);

  return useMutation<RemoveTrackResult, Error, RemoveTrackParams, { previousTrack?: NormalizedTrackMeta }>(
    (removeParams: RemoveTrackParams) => apiRemoveTrack(removeParams),
    {
      // Optimistic update: remove from store immediately
      onMutate: async (removeParams: RemoveTrackParams) => {
        const trackId = removeParams.trackId;
        
        // Cancel outgoing refetches
        await queryClient.cancelQueries(['track', trackId]);
        
        // Snapshot the current value for rollback
        const previousTrack = getTrack(trackId);
        
        // Optimistically remove from all stores
        if (previousTrack) {
          cascadeDeleteTrack(trackId);
        }
        
        return { previousTrack };
      },
      
      onSuccess: (_, removeParams, context) => {
        const trackId = removeParams.trackId;
        
        // Invalidate parent project's tracks list
        if (context?.previousTrack) {
          queryClient.invalidateQueries(['tracks']);
        }
        
        // Remove the individual query
        queryClient.removeQueries(['track', trackId]);
      },
      
      onError: (error: Error, removeParams, context) => {
        console.error('Failed to delete track:', error);
        
        if (context?.previousTrack) {
          queryClient.invalidateQueries(['track', removeParams.trackId]);
          queryClient.invalidateQueries(['tracks']);
        }
      },
    }
  );
};

/**
 * Rename Track Mutation (simpler example)
 */
export const useRenameTrack = () => {
  const queryClient = useQueryClient();
  const updateTrack = useTrackStore(state => state.updateTrack);
  const getTrack = useTrackStore(state => state.getTrack);

  return useMutation<
    void,
    Error,
    { trackId: string; newName: string },
    { previousTrack?: NormalizedTrackMeta }
  >(
    async ({ trackId, newName }) => {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to rename track');
    },
    {
      onMutate: async ({ trackId, newName }) => {
        const previousTrack = getTrack(trackId);
        if (previousTrack) {
          updateTrack(trackId, {
            trackInfo: {
              ...previousTrack.trackInfo,
              name: newName,
            },
          });
        }

        return { previousTrack };
      },
      
      onError: (_, { trackId }, context) => {
        if (context?.previousTrack) {
          updateTrack(trackId, context.previousTrack);
        }
      },

      onSettled: (_, __, { trackId }) => {
        queryClient.invalidateQueries(['track', trackId]);
      },
    }
  );
};
