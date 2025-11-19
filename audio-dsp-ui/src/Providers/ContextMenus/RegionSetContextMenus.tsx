// RegionContextMenuContainer.tsx - Updated


import { useRegionSetController } from "@/components/controllers/RegionSetController";
import { RegionSetContextMenu } from "@/components/dashboard/context-menus/region-set-context-menu";
import { useUIStore } from "@/Stores/UIStore";


export function RegionSetContextMenus() {
  const rightClickContext=useUIStore(state=>state.rightClickContext);
  const setRightClickContext=useUIStore(state=>state.openContextMenu);
  const clipboard=useUIStore(state=>state.clipboard);
  const closeContextMenu=useUIStore(state=>state.closeContextMenu);
  const controller=useRegionSetController();

  if (rightClickContext?.type !== "region") return null;
 //used typed clipboards
  const { trackId, regionSetId, regionId, x, y } = rightClickContext;


 return (
     <RegionSetContextMenu
       x={x}
       y={y}
       trackId={trackId}
       regionSetId={regionSetId}
       onCreateRegion={()=>controller.handleCreateRegion(trackId,regionSetId)}
       onClose={closeContextMenu}
       onDetails={()=>controller.handleDetailsRegionSet(trackId,regionSetId)}
       onRename={()=>controller.handleRenameRegionSet(trackId,regionSetId)}
       onCopyRegionSet={()=>controller.handleCopyRegionSet(trackId,regionSetId)}
       onPasteRegion={()=>controller.handlePasteRegion(clipboard.)}
       canPasteRegion={clipboard?.type === "graph"}
       onRemove={() => actions.deleteRegion(regionId, regionSetId, trackId)}
     />
   );
 
}
