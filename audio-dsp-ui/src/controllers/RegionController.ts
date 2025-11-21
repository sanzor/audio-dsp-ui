// hooks/useRegionSetController.ts
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useUIStore } from "@/Stores/UIStore";
import type { PasteRegionParams } from "@/Stores/PasteParams";
import { useCopyGraph, useCreateGraph } from "@/Orchestrators/Graphs/useGraphMutations";
import { useDeleteRegion, useEditRegion } from "@/Orchestrators/Regions/useRegionMutations";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import type { CreateGraphParams } from "@/Dtos/Graphs/CreateGraphParams";


export function useRegionController() {
  // Zustand selectors
  const copyToClipboard = useUIStore(state => state.copyToClipboard);
  const closeModal = useUIStore(state => state.closeModal);
  const openModal = useUIStore(state => state.openModal);
  const closeContextMenu = useUIStore(state => state.closeContextMenu);
  
  // Data and mutations
  const trackMap = useTrackViewModelMap();
  const createGraphMutation = useCreateGraph();
  const copyGraphMutation = useCopyGraph();
  const deleteRegionMutation = useDeleteRegion();
  const renameRegionMutation = useEditRegion();

  // Helper function
  const findRegion = (trackId: string, regionSetId: string,regionId:string): TrackRegionViewModel | null => {
    const track = trackMap.get(trackId);
    if (!track) return null;
    const set= track.regionSets.find(set => set.id === regionSetId);
    if(!set) return null;
    const region=set.regions.find(region=>region.region_id===regionId);
    if(!region) return null;
  };

  return {
    // ============================================
    // CREATE REGION
    // ============================================
    handleCreateGraph: (trackId: string, regionSetId: string,regionId:string) => {
      const region = findRegion(trackId, regionSetId,regionId);
      if (!region) {
        console.error('Region set not found:', { trackId, regionSetId });
        return;
      }
      
      openModal({ type: 'createGraph', trackId, regionSetId,regionId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitCreateGraph: async (params: CreateGraphParams) => {
      try {
        await createGraphMutation.mutateAsync(params);
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to create graph:', error);
        // ❌ Don't close modal on error - let user fix/retry
        // Optional: Show error toast or inline error
        throw error; // Re-throw so modal can handle it
      }
    },

    // ============================================
    // DETAILS REGION SET
    // ============================================
    handleDetailsRegion: (trackId: string, regionSetId: string,regionId:string) => {
      const region = findRegion(trackId, regionSetId,regionId);
      if (!region) {
        console.error('Region not found:', { trackId, regionSetId });
        return;
      }
      
      openModal({ type: 'detailsRegion', trackId, regionSetId,regionId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    // ============================================
    // RENAME REGION SET
    // ============================================
    handleEditRegion: (trackId: string, regionSetId: string,regionId:string) => {
      const region = findRegion(trackId, regionSetId,regionId);
      if (!region) {
        console.error('Region  not found:', { trackId, regionSetId,regionId });
        return;
      }
      
      openModal({ type: "renameRegion", trackId, regionSetId,regionId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitRenameRegion: async (trackId: string, regionSetId: string,regionId:string, newName: string) => {
      try {
        await renameRegionMutation.mutateAsync({ regionSetId: regionSetId,regionId:regionId,name: newName,trackId:trackId });
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to rename region:', error);
        // ❌ Don't close modal on error
        throw error;
      }
    },

    // ============================================
    // DELETE REGION 
    // ============================================
    handleDeleteRegion: async (regionId:string,regionSetId: string, trackId: string) => {
      try {
        await deleteRegionMutation.mutateAsync({ trackId: trackId, regionId:regionId,regionSetId:regionSetId });
        closeContextMenu(); // ✅ Close context menu after successful action
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to delete region:', error);
        closeContextMenu(); // ✅ Still close context menu on error
        // Optional: Show error toast
        throw error;
      }
    },

    // ============================================
    // COPY REGION SET
    // ============================================
    handleCopyRegion: (trackId: string, regionSetId: string,regionId:string) => {
      const region = findRegion(trackId, regionSetId,regionId);
      if (!region) {
        console.error('Region not found:', { trackId, regionSetId });
        return;
      }
      
      copyToClipboard({ type: "region", trackId, regionSetId ,regionId});
      closeContextMenu(); // ✅ Close context menu after action
      
      // Optional: Show success toast
      console.log("Copied region:", region.name);
    },

    // ============================================
    // PASTE REGION
    // ============================================
    handlePasteGraph(destTrackId:string, destRegionSetId:string,destRegionId:string) {
      // 1. Validate source type
      const clipboard = useUIStore.getState().clipboard;
      if (!clipboard || clipboard.type !== "graph") return;

      // 2. Validate destination existence
      const destRegion = findRegion(destTrackId, destRegionSetId,destRegionId);
      if (!destRegion) return;

      // 3. (Optional but recommended) Validate source existence
      const sourceTrack = trackMap.get(clipboard.trackId);
      if (!sourceTrack) return;

      const sourceRegion = findRegion(sourceTrack.track_id, clipboard.regionSetId,clipboard.regionId);
      if (!sourceRegion) return;

      const sourceGraph = sourceRegion.graph;
      if (!sourceGraph) return;

      // 4. Everything valid → open modal
      openModal({
        type: "pasteGraph",
        params: {
          source: {
            regionId: clipboard.regionId,
            regionSetId: clipboard.regionSetId,
            graphId:clipboard.graphId,
            trackId: clipboard.trackId
          },
          destination: {
            regionId:destRegionId,
            
            regionSetId: destRegionSetId,
            trackId: destTrackId
          }
        }
      });

      closeContextMenu();
    },

    handleSubmitPasteRegion: async (params: PasteRegionParams, regionName: string) => {
      try {
        await copyGraphMutation.mutateAsync({
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