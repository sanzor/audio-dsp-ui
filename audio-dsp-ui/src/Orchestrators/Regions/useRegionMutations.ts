import { useMutation, useQueryClient } from 'react-query';
import { useRegionSetStore } from '@/Stores/RegionSetStore';
import { useRegionStore } from '@/Stores/RegionStore';
import { cascadeDeleteRegion } from './utils';
import { normalizeRegionSetWithCascade } from '../RegionSets/utils';
import { apiAddRegion, apiCopyRegion, apiEditRegion, apiRemoveRegion } from '@/Services/RegionsService';
import type { CopyRegionParams } from '@/Dtos/Regions/CopyRegionParams';
import type { CopyRegionResult } from '@/Dtos/Regions/CopyRegionResult';
import type { CreateRegionParams } from '@/Dtos/Regions/CreateRegionParams';
import type { CreateRegionResult } from '@/Dtos/Regions/CreateRegionResult';
import type { EditRegionParams } from '@/Dtos/Regions/EditRegionParams';
import type { EditRegionResult } from '@/Dtos/Regions/EditRegionResult';
import type { RemoveRegionParams } from '@/Dtos/Regions/RemoveRegionParams';
import type { RemoveRegionResult } from '@/Dtos/Regions/RemoveRegionResult';
import type { NormalizedTrackRegion } from '@/Domain/Region/NormalizedTrackRegion';

const useRegionSetRefresh = () => {
  const queryClient = useQueryClient();
  const addRegionSet = useRegionSetStore(state => state.addRegionSet);

  return (trackRegionSet: CreateRegionResult['region_set']) => {
    const normalized = normalizeRegionSetWithCascade(trackRegionSet);
    addRegionSet(normalized);
    queryClient.invalidateQueries(['regionSet', normalized.id]);
    queryClient.invalidateQueries(['regionSets', 'track', normalized.track_id]);
    return normalized;
  };
};

export const useCreateRegion = () => {
  const queryClient = useQueryClient();
  const upsertRegionSet = useRegionSetRefresh();

  return useMutation<CreateRegionResult, Error, CreateRegionParams>({
    mutationFn: (params) => apiAddRegion(params),
    onSuccess: (data) => {
      upsertRegionSet(data.region_set);
      queryClient.invalidateQueries(['regions', 'set', data.region_set.id]);
    },
    onError: (error) => {
      console.error('Failed to create region', error);
    },
  });
};

export const useCopyRegion = () => {
  const upsertRegionSet = useRegionSetRefresh();

  return useMutation<CopyRegionResult, Error, CopyRegionParams>({
    mutationFn: (params) => apiCopyRegion(params),
    onSuccess: (data) => {
      upsertRegionSet(data.regionSet);
    },
    onError: (error) => {
      console.error('Failed to copy region', error);
    },
  });
};

export const useEditRegion = () => {
  const upsertRegionSet = useRegionSetRefresh();

  return useMutation<EditRegionResult, Error, EditRegionParams>({
    mutationFn: (params) => apiEditRegion(params),
    onSuccess: (data) => {
      upsertRegionSet(data.region_set);
    },
    onError: (error) => {
      console.error('Failed to edit region', error);
    },
  });
};

export const useDeleteRegion = () => {
  const queryClient = useQueryClient();
  const getRegion = useRegionStore(state => state.getRegion);

  return useMutation<RemoveRegionResult, Error, RemoveRegionParams, { previousRegion?: NormalizedTrackRegion }>(
    (params) => apiRemoveRegion(params),
    {
      onMutate: async (params) => {
        await queryClient.cancelQueries(['region', params.regionId]);
        const previousRegion = getRegion(params.regionId);

        if (previousRegion) {
          cascadeDeleteRegion(params.regionId);
        }

        return { previousRegion };
      },
      onSuccess: (_, params) => {
        queryClient.invalidateQueries(['regionSet', params.regionSetId]);
      },
      onError: (error, params, context) => {
        console.error('Failed to delete region', error);

        if (context?.previousRegion) {
          const addRegion = useRegionStore.getState().addRegion;
          const attachRegion = useRegionSetStore.getState().attachRegion;

          addRegion(context.previousRegion);
          attachRegion(context.previousRegion.region_set_id, context.previousRegion.region_id);
        }

        queryClient.invalidateQueries(['regionSet', params.regionSetId]);
        queryClient.invalidateQueries(['region', params.regionId]);
      },
    }
  );
};
