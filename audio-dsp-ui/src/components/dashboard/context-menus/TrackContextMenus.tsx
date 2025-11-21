// RegionContextMenuContainer.tsx - Updated
import { useTrackController } from "@/controllers/TrackController";
import { useUIStore } from "@/Stores/UIStore";
import { TrackContextMenu } from "./track-context-menu";


export function TrackContextMenus() {
  const rightClickContext=useUIStore(state=>state.rightClickContext);
  const clipboard = useUIStore(state => state.clipboard);
  const closeContextMenu=useUIStore(state=>state.closeContextMenu);
  const controller=useTrackController();

  if (rightClickContext?.type !== "regionSet") return null;
 //used typed clipboards
  const { trackId, regionSetId, x, y } = rightClickContext;

 

  return (
     <TrackContextMenu
       x={x}
       y={y}
       trackId={trackId}
       onCreateRegionSet={()=>controller.handleCreateRegionSet(trackId)}
       onClose={closeContextMenu}
       onDetails={()=>controller.handleDetailsTrack(trackId)}
       onRename={()=>controller.handleRenameTrack(trackId)}
       onCopyTrack={()=>controller.handleCopyTrack(trackId)}
       onPasteRegionSet={()=>controller.handlePasteRegionSet(trackId)}
       canPasteRegionSet={clipboard?.type === "regionSet"}
       onRemove={() => controller.handleDeleteRegionSet(regionSetId,trackId)}
     />
   );
 
}
