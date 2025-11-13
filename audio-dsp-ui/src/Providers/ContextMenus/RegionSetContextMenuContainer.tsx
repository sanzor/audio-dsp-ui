// RegionContextMenuContainer.tsx - Updated

import { useRegionActions } from "@/Actions/region-actions";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { useRegionSetModals } from "../Modals/UseRegionSetModals";
import { RegionSetContextMenu } from "@/components/dashboard/context-menus/region-set-context-menu";


export function RegionContextMenuContainer() {
  const { rightClickContext, setRightClickContext, clipboard,setClipboard } = useUIState();
  const { openDetailsModal, openRenameModal, openCopyRegionModal } = useRegionSetModals();
  const actions = useRegionActions();

  if (rightClickContext?.type !== "region") return null;

  const { trackId, regionSetId, regionId, x, y } = rightClickContext;


 return (
     <RegionSetContextMenu
       x={x}
       y={y}
       trackId={trackId}
       regionSetId={regionSetId}
       onCreateRegion={}
       onClose={() => setRightClickContext(null)}
       onDetails={() => openDetailsModal(regionId, regionSetId)}
       onRename={() => openRenameModal(regionId, regionSetId)}
       onCopyRegionSet={() => 
         setClipboard({ type: "regionSet",
                  
                  regionSetId:rightClickContext.regionSetId,
                  trackId:rightClickContext.trackId })}
       onPasteRegion={() => {
         if (clipboard?.type === "region") {
           openCopyRegionModal(regionId, clipboard.regionId);
         }
       }}
       canPasteRegion={clipboard?.type === "graph"}
       onRemove={() => actions.deleteRegion(regionId, regionSetId, trackId)}
     />
   );
 
}