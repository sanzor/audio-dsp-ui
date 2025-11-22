// RegionModals.tsx - Updated coordinator component

import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useGraphStore } from "@/Stores/GraphStore";

import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import { useRegionModals } from "@/Providers/Modals/UseRegionModals";
import { DetailsRegionModal } from "./details-region-modal";
import { RegionRenameModal } from "./rename-region-modal";
import { CopyGraphModal } from "../graph/copy-graph-modal";
import { useUIStore } from "@/Stores/UIStore";

export function RegionModals() {
  const { modalState, closeModal } = useRegionModals();
  const { clipboard } = useUIStore();
  const regionMap = useTrackViewModelMap();
  
  const clipboardGraphId = clipboard?.type === "graph" ? clipboard.graphId : null;
  const clipboardGraph = useGraphStore(state =>
    clipboardGraphId ? state.getGraph(clipboardGraphId) ?? null : null
  );

  const findRegion = (regionId: string): TrackRegionViewModel | null => {
    const track = trackMap.get(trackId);
    const rs = track?.regionSets.find(r => r.id === regionSetId);
    return rs?.regions.find(r => r.region_id === regionId) ?? null;
  };

  // Get current region for modals
  const currentRegion = modalState && modalState.type !== "copyGraph"
    ? findRegion(modalState.trackId, modalState.regionSetId, modalState.regionId)
    : null;

  return (
    <>
      {modalState?.type === "details" && currentRegion && (
        <DetailsRegionModal
          region={currentRegion}
          open
          onClose={closeModal}
        />
      )}

      {modalState?.type === "rename" && currentRegion && (
        <RegionRenameModal
          regionToRename={currentRegion}
          open
          onClose={closeModal}
          onSubmit={(_, newName) => {
            actions.renameRegion(
              modalState.regionId,
              
              newName
            );
            closeModal();
          }}
        />
      )}

      {modalState?.type === "copyGraph" && clipboardGraph && (
        <CopyGraphModal
          sourceGraphName={clipboardGraph.name}
          open
          onClose={closeModal}
          onSubmit={(copyName) => {
            actions.pasteGraph(modalState.regionId, copyName);
            closeModal();
          }}
        />
      )}
    </>
  );
}