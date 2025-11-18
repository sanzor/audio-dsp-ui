// RegionContextMenuContainer.tsx - Updated

import { useRegionActions } from "@/Actions/region-actions";
import { useUIState } from "@/Providers/UIStore/UseUIStateProvider";
import { useRegionModals } from "../Modals/UseRegionModals";
import { TrackContextMenu } from "@/components/dashboard/context-menus/track-context-menu";

export function RegionContextMenuContainer() {
  const { rightClickContext, setRightClickContext, clipboard, setClipboard } = useUIState();
  const { openDetailsModal, openRenameModal, openCopyGraphModal } = useRegionModals();
  const actions = useRegionActions();

  if (rightClickContext?.type !== "region") return null;

  const { trackId, regionSetId, regionId, x, y } = rightClickContext;


    return (<TrackContextMenu
           x={rightClickContext.x}
           y={rightClickContext.y}
           trackId={rightClickContext.trackId}
           canPasteRegionSet={clipboard?.type==="regionSet"}
           onClose={() => setRightClickContext(null)}
           onCopyTrack={() => 
             setClipboard({ type: "track", 
                 trackId:rightClickContext.trackId })}
           onPasteRegionSet={}
           onDetails={}
           onRemove={}
           onRename={}
           onCreateRegionSet={}
         />)
}