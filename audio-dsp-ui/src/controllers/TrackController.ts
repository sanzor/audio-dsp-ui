// hooks/useRegionSetController.ts
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useCopyRegionSet, useCreateRegionSet} from "@/Orchestrators/RegionSets/useRegionSetsMutations";
import { useUIStore } from "@/Stores/UIStore";
import type {  PasteRegionSetParams } from "@/Stores/PasteParams";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import { useDeleteTrack, useRenameTrack } from "@/Orchestrators/Tracks/useTrackMutations";


export function useTrackController() {
  // Zustand selectors
  const copyToClipboard = useUIStore(state => state.copyToClipboard);
  const closeModal = useUIStore(state => state.closeModal);
  const openModal = useUIStore(state => state.openModal);
  const closeContextMenu = useUIStore(state => state.closeContextMenu);
  
  // Data and mutations
  const trackMap = useTrackViewModelMap();
  const createRegionSetMutation = useCreateRegionSet();
  const copyRegionSetMutation = useCopyRegionSet();
  const deleteTrackMutation = useDeleteTrack();
  const renameTrackMutation = useRenameTrack();

  // Helper function
  const findTrack = (trackId: string): TrackMetaViewModel | null => {
    const track = trackMap.get(trackId);
    if(!track) return null;
    return track;
  };

  return {
    // ============================================
    // CREATE REGION
    // ============================================
    handleCreateRegionSet: (trackId: string) => {
      const track = findTrack(trackId);
      if (!track) {
        console.error('Track not found:', { trackId });
        return;
      }
      
      openModal({ type: 'createRegionSet', trackId});
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitCreateRegionSet: async (params: CreateRegionSetParams) => {
      try {
        await createRegionSetMutation.mutateAsync(params);
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
    handleDetailsTrack: (trackId: string) => {
      const regionSet = findTrack(trackId);
      if (!regionSet) {
        console.error('Track  not found:', { trackId });
        return;
      }
      
      openModal({ type: 'detailsTrack', trackId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    // ============================================
    // RENAME REGION SET
    // ============================================
    handleRenameTrack: (trackId: string) => {
      const regionSet = findTrack(trackId);
      if (!regionSet) {
        console.error('Track not found:', { trackId });
        return;
      }
      
      openModal({ type: "renameTrack", trackId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitRenameTrack: async (trackId: string, newName: string) => {
      try {
        await renameTrackMutation.mutateAsync({ trackId: trackId, newName });
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
    handleDeleteRegionSet: async ( trackId: string) => {
      try {
        await deleteTrackMutation.mutateAsync({ trackId: trackId });
        closeContextMenu(); // ✅ Close context menu after successful action
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to delete track:', error);
        closeContextMenu(); // ✅ Still close context menu on error
        // Optional: Show error toast
        throw error;
      }
    },

    // ============================================
    // COPY REGION SET
    // ============================================
    handleCopyTrack: (trackId: string) => {
      const track = findTrack(trackId);
      if (!track) {
        console.error('Track not found:', { trackId });
        return;
      }
      
      copyToClipboard({ type: "track", trackId });
      closeContextMenu(); // ✅ Close context menu after action
      
      // Optional: Show success toast
      console.log("Copied track:", track.track_id);
    },

    // ============================================
    // PASTE REGION
    // ============================================
    handlePasteRegionSet(destTrackId:string) {
      // 1. Validate source type
      const clipboard = useUIStore.getState().clipboard;
      if (!clipboard || clipboard.type !== "region") return;

      // 2. Validate destination existence
      const destTrack = findTrack(destTrackId);
      if (!destTrack) return;

      // 3. (Optional but recommended) Validate source existence
      const sourceTrack = trackMap.get(clipboard.trackId);
      if (!sourceTrack) return;

      const sourceRegionSet = sourceTrack.regionSets.find(x=>x.id===destTrackId);
      if (!sourceRegionSet) return;

      

      // 4. Everything valid → open modal
      openModal({
        type: "pasteRegionSet",
        params: {
          source: {
            regionSetId: clipboard.regionSetId,
            trackId: clipboard.trackId
          },
          destination: {
            trackId: destTrackId
          }
        }
      });

      closeContextMenu();
    },

    handleSubmitPasteRegionSet: async (params: PasteRegionSetParams, regionSetName: string) => {
      try {
        await copyRegionSetMutation.mutateAsync({
            destTrackId:params.destination.trackId,
            sourceRegionSetId:params.source.regionSetId,
            sourceTrackId:params.source.trackId,
            copy_region_set_name:regionSetName
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