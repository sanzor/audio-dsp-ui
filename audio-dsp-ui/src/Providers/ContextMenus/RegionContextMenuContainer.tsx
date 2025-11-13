// RegionContextMenuContainer.tsx - Updated

import { useRegionActions } from "@/Actions/region-actions";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { useRegionModals } from "../Modals/UseRegionModals";
import { RegionContextMenu } from "@/components/dashboard/context-menus/region-context-menu";

export function RegionContextMenuContainer() {
  const { rightClickContext, setRightClickContext, clipboard, setClipboard } = useUIState();
  const { openDetailsModal, openRenameModal, openCopyGraphModal,openCreateGraphModal } = useRegionModals();
  const actions = useRegionActions();

  if (rightClickContext?.type !== "region") return null;

  const { trackId, regionSetId, regionId, x, y } = rightClickContext;


  return (
    <RegionContextMenu
      x={x}
      y={y}
      trackId={trackId}
      regionSetId={regionSetId}
      regionId={regionId}
      onClose={() => setRightClickContext(null)}
      onDetails={() => openDetailsModal(regionId, regionSetId, trackId)}
      onRename={() => openRenameModal(regionId, regionSetId, trackId)}
      onCopyRegion={() => 
        setClipboard({ type: "region",
                 regionId:rightClickContext.regionId,
                 regionSetId:rightClickContext.regionSetId,
                 trackId:rightClickContext.trackId })}
      onCreateGraph={openCreateGraphModal}
      onPasteGraph={() => {
        if (clipboard?.type === "graph") {
          openCopyGraphModal(
            {
                regionId:clipboard.regionId,
                regionSetId:clipboard.regionSetId,
                trackId:clipboard.trackId,
                graphId:clipboard.graphId},
            {
                regionId:regionId,
                regionSetId:regionSetId,
                trackId:trackId
            });
        }
      }}
      canPasteGraph={clipboard?.type === "graph"}
      onRemove={() => actions.deleteRegion(regionId, regionSetId, trackId)}
    />
  );
}