// RegionContextMenuContainer.tsx - Updated


import { useRegionSetController } from "@/controllers/RegionSetController";
import { RegionSetContextMenu } from "@/components/dashboard/context-menus/region-set-context-menu";
import { useUIStore } from "@/Stores/UIStore";


export function RegionSetContextMenus() {
  const rightClickContext=useUIStore(state=>state.rightClickContext);
  const clipboard = useUIStore(state => state.clipboard);
  const closeContextMenu=useUIStore(state=>state.closeContextMenu);
  const controller=useRegionSetController();

  if (rightClickContext?.type !== "regionSet") return null;
 //used typed clipboards
  const { trackId, regionSetId, x, y } = rightClickContext;

 

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
       onPasteRegion={()=>controller.handlePasteRegion(trackId,regionSetId)}
       canPasteRegion={clipboard?.type === "region"}
       onRemove={() => controller.handleDeleteRegionSet(regionSetId,trackId)}
     />
   );
 
}
