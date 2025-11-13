// RegionActions.ts


import { useDeleteRegion, useEditRegion } from "@/Orchestrators/Regions/useRegionMutations";
import { useCopyGraph } from "@/Orchestrators/Graphs/useGraphMutations";
import { useRegionStore } from "@/Stores/RegionStore";
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useUIState } from "@/Providers/UseUIStateProvider";

export function useRegionActions() {
  const {clipboard,setClipboard} = useUIState();
  
  const trackMap = useTrackViewModelMap();

  const deleteRegion = useDeleteRegion();
  const editRegion = useEditRegion();
  const copyGraph = useCopyGraph();
  const updateRegion = useRegionStore(state => state.updateRegion);

  const findRegion = (trackId: string, regionSetId: string, regionId: string) => {
    const track = trackMap.get(trackId);
    const rs = track?.regionSets.find(r => r.id === regionSetId);
    return rs?.regions.find(r => r.region_id === regionId) ?? null;
  };

  return {

    copyRegion(regionId:string, regionSetId:string, trackId:string) {
      setClipboard({ type: "region", regionId, regionSetId, trackId });
    },

    renameRegion(regionId:string, regionSetId:string, trackId:string, newName:string) {
      editRegion.mutate({ name:newName,regionId:regionId,regionSetId:regionSetId,trackId:trackId });
    },

    deleteRegion(regionId:string, regionSetId:string, trackId:string) {
      deleteRegion.mutate({ regionId, regionSetId, trackId });
    },

    copyGraph(regionId:string, regionSetId:string, trackId:string) {
      const region = findRegion(trackId, regionSetId, regionId);
      if (!region?.graph?.id) return;
      setClipboard({
        type: "graph",
        graphId: region.graph.id,
        regionId,
        regionSetId,
        trackId
      });
    },

    pasteGraph(regionId:string,graphNewName:string) {
      if (clipboard?.type !== "graph") return;

      copyGraph.mutate({
        destinationRegionId: regionId,
        graphId: clipboard.graphId,
        copyName: graphNewName
      }, {
        onSuccess(res) {
          updateRegion(regionId, { graphId: res.graph.id });
        }
      });
    }
  };
}
