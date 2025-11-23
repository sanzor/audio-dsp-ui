// hooks/useRegionSetController.ts
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useCopyRegion, useCreateRegion } from "@/Orchestrators/Regions/useRegionMutations";
import { useDeleteRegionSet, useRenameRegionSet } from "@/Orchestrators/RegionSets/useRegionSetsMutations";
import { useUIStore } from "@/Stores/UIStore";
import type { PasteRegionParams } from "@/Stores/PasteParams";


export function useRegionSetController() {
  // Zustand selectors
  const copyToClipboard = useUIStore(state => state.copyToClipboard);
  const closeModal = useUIStore(state => state.closeModal);
  const openModal = useUIStore(state => state.openModal);
  const closeContextMenu = useUIStore(state => state.closeContextMenu);
  
  // Data and mutations
  const trackMap = useTrackViewModelMap();
  const createRegionMutation = useCreateRegion();
  const copyRegionMutation = useCopyRegion();
  const deleteRegionSetMutation = useDeleteRegionSet();
  const renameRegionSetMutation = useRenameRegionSet();

  // Helper function
  const findRegionSet = (trackId: string, regionSetId: string): TrackRegionSetViewModel | null => {
    const track = trackMap.get(trackId);
    if (!track) return null;
    return track.regionSets.find(set => set.id === regionSetId) ?? null;
  };

  return {
    // ============================================
    // CREATE REGION
    // ============================================
    handleCreateRegion: (trackId: string, regionSetId: string) => {
      const regionSet = findRegionSet(trackId, regionSetId);
      if (!regionSet) {
        console.error('Region set not found:', { trackId, regionSetId });
        return;
      }
      
      openModal({ type: 'createRegion', trackId, regionSetId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitCreateRegion: async (params: CreateRegionParams) => {
      try {
        await createRegionMutation.mutateAsync(params);
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to create region:', error);
        // ❌ Don't close modal on error - let user fix/retry
        // Optional: Show error toast or inline error
        throw error; // Re-throw so modal can handle it
      }
    },

    // ============================================
    // DETAILS REGION SET
    // ============================================
    handleDetailsRegionSet: (trackId: string, regionSetId: string) => {
      const regionSet = findRegionSet(trackId, regionSetId);
      if (!regionSet) {
        console.error('Region set not found:', { trackId, regionSetId });
        return;
      }
      
      openModal({ type: 'detailsRegionSet', trackId, regionSetId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    // ============================================
    // RENAME REGION SET
    // ============================================
    handleRenameRegionSet: (trackId: string, regionSetId: string) => {
      const regionSet = findRegionSet(trackId, regionSetId);
      if (!regionSet) {
        console.error('Region set not found:', { trackId, regionSetId });
        return;
      }
      
      openModal({ type: "renameRegionSet", trackId, regionSetId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitRenameRegionSet: async (trackId: string, regionSetId: string, newName: string) => {
      try {
        await renameRegionSetMutation.mutateAsync({ setId: regionSetId, newName });
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to rename region set:', error);
        // ❌ Don't close modal on error
        throw error;
      }
    },

    // ============================================
    // DELETE REGION SET
    // ============================================
    handleDeleteRegionSet: async (regionSetId: string, trackId: string) => {
      try {
        await deleteRegionSetMutation.mutateAsync({ track_id: trackId, regionSetId });
        closeContextMenu(); // ✅ Close context menu after successful action
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to delete region set:', error);
        closeContextMenu(); // ✅ Still close context menu on error
        // Optional: Show error toast
        throw error;
      }
    },

    // ============================================
    // COPY REGION SET
    // ============================================
    handleCopyRegionSet: (trackId: string, regionSetId: string) => {
      const regionSet = findRegionSet(trackId, regionSetId);
      if (!regionSet) {
        console.error('Region set not found:', { trackId, regionSetId });
        return;
      }
      
      copyToClipboard({ type: "regionSet", trackId, regionSetId });
      closeContextMenu(); // ✅ Close context menu after action
      
      // Optional: Show success toast
      console.log("Copied region set:", regionSet.name);
    },

    // ============================================
    // PASTE REGION
    // ============================================
    handlePasteRegion(destTrackId:string, destRegionSetId:string) {
      // 1. Validate source type
      const clipboard = useUIStore.getState().clipboard;
      if (!clipboard || clipboard.type !== "region") return;

      // 2. Validate destination existence
      const destRegionSet = findRegionSet(destTrackId, destRegionSetId);
      if (!destRegionSet) return;

      // 3. (Optional but recommended) Validate source existence
      const sourceTrack = trackMap.get(clipboard.trackId);
      if (!sourceTrack) return;

      const sourceRegionSet = findRegionSet(sourceTrack.track_id, clipboard.regionSetId);
      if (!sourceRegionSet) return;

      const sourceRegion = sourceRegionSet.regions.find(r => r.regionId === clipboard.regionId);
      if (!sourceRegion) return;

      // 4. Everything valid → open modal
      openModal({
        type: "pasteRegion",
        params: {
          source: {
            regionId: clipboard.regionId,
            regionSetId: clipboard.regionSetId,
            trackId: clipboard.trackId
          },
          destination: {
            regionSetId: destRegionSetId,
            trackId: destTrackId
          }
        }
      });

      closeContextMenu();
    },

    handleSubmitPasteRegion: async (params: PasteRegionParams, regionName: string) => {
      try {
        await copyRegionMutation.mutateAsync({
          copyName: regionName,
          destinationRegionSetId: params.destination.regionSetId,
          destinationTrackId: params.destination.trackId,
          sourceRegionId: params.source.regionId,
          sourceRegionSetId: params.source.regionSetId,
          sourceTrackId: params.source.trackId
        });
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to paste region:', error);
        // ❌ Don't close modal on error
        throw error;
      }
    },
  };
}