// hooks/useRegionSetController.ts

import { useUIStore } from "@/Stores/UIStore";

import type { CreateGraphParams } from "@/Dtos/Graphs/CreateGraphParams";
import { useRegionStore } from "@/Stores/RegionStore";
import { useCreateGraph, useDeleteGraph, useEditGraph } from "@/Orchestrators/Graphs/useGraphMutations";
import { useGraphStore } from "@/Stores/GraphStore";


export function useGraphController() {
  // Zustand selectors
  const copyToClipboard = useUIStore(state => state.copyToClipboard);
  const closeModal = useUIStore(state => state.closeModal);
  const openModal = useUIStore(state => state.openModal);
  const closeContextMenu = useUIStore(state => state.closeContextMenu);
  
  // Data and mutations
  const regionMap = useRegionStore(x=>x.regions);
  const graphMap = useGraphStore(x=>x.graphs);
  // const createNodeMutation = useCreateGraph();
  // const copyGraphMutation = useCopyGraph();
  const deleteGraphMutation = useDeleteGraph();
  const createGraphMutation=useCreateGraph();
  const renameGraphMutation = useEditGraph();

  // Helper function


  return {
    // ============================================
    // CREATE REGION
    // ============================================
    handleCreateGraph: (regionId:string) => {
      const region = regionMap.get(regionId);
      if (!region) {
        console.error('Region  not found:', { regionId});
        return;
      }
      
      openModal({ type: 'createGraph',regionId });
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
    handleDetailsGraph: (graphId:string) => {
       const graph = graphMap.get(graphId);
      if (!graph) {
        console.error('Graph  not found:', { regionId: graphId});
        return;
      }
      
      
      openModal({ type: 'detailsRegion',regionId: graphId });
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    // ============================================
    // RENAME REGION SET
    // ============================================
    handleRenameGraph: (graphId:string) => {
      const graph = graphMap.get(graphId);
      if (!graph) {
        console.error('Graph  not found:', { graphId});
        return;
      }
      
      openModal({ type: "renameGraph", graphId});
      closeContextMenu(); // ✅ Close context menu when opening modal
    },

    handleSubmitRenameGraph: async (graphId:string,newName: string) => {
      try {
        await renameGraphMutation.mutateAsync({ id:graphId,name: newName});
        closeModal(); // ✅ Close modal on success
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to rename graph:', error);
        // ❌ Don't close modal on error
        throw error;
      }
    },

    // ============================================
    // DELETE REGION 
    // ============================================
    handleDeleteGraph: async (graphId:string) => {
      try {
        await deleteGraphMutation.mutateAsync({graph_id:graphId });
        closeContextMenu(); // ✅ Close context menu after successful action
        // Optional: Show success toast
      } catch (error) {
        console.error('Failed to delete graph:', error);
        closeContextMenu(); // ✅ Still close context menu on error
        // Optional: Show error toast
        throw error;
      }
    },

    // ============================================
    // COPY REGION SET
    // ============================================
    handleCopyGraph: (graphId:string) => {
      const graph = graphMap.get(graphId);
      if (!graph) {
        console.error('Graph  not found:', { graphId});
        return;
      }
      
      copyToClipboard({ type: "graph", graphId});
      closeContextMenu(); // ✅ Close context menu after action
      
      // Optional: Show success toast
      console.log("Copied graph:", graph.id);
    },

    // ============================================
    // PASTE REGION
    // ============================================
    // handlePasteNode(destGraphId:string) {
    //   // 1. Validate source type
      
    //   closeContextMenu();
    // },
    // handlePasteEdge(destGraphId:string) {
    //   // 1. Validate source type
      
    //   closeContextMenu();
    // },

    // handleSubmitPasteNode: async (params: PasteGraphParams, nodeId: string) => {
     
    // },
    // handleSubmitPasteEdge: async (params: PasteGraphParams, edgeId: string) => {
     
    // }
  }
}