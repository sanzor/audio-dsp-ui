import { useUIState } from "@/Providers/UseUIStateProvider";
import { RegionContextMenu } from "./region-context-menu";
import { RegionSetContextMenu } from "./region-set-context-menu";
import { TrackContextMenu } from "./track-context-menu";

export function ContextMenus() {
  const { rightClickContext, setRightClickContext, clipboard, setClipboard } = useUIState();
  
  if (!rightClickContext) return null;

  switch (rightClickContext.type) {
    case "region": {
      
      
      return (
        <RegionContextMenu
          x={rightClickContext.x}
          y={rightClickContext.y}
          regionId={rightClickContext.regionId}
          regionSetId={rightClickContext.regionSetId}
          trackId={rightClickContext.trackId}
          canPasteGraph={clipboard?.type==="graph"}
          onClose={() => setRightClickContext(null)}
          onCopyRegion={() => 
            setClipboard({ type: "region", 
                regionId:rightClickContext.regionId,
                regionSetId:rightClickContext.regionSetId,
                trackId:rightClickContext.trackId })}
          onPasteGraph={}
          onDetails={}
          onRemove={}
          onRename={}
        />
    )}

    case "regionSet":
      return (<RegionSetContextMenu
          x={rightClickContext.x}
          y={rightClickContext.y}
          trackId={rightClickContext.trackId}
          regionSetId={rightClickContext.regionSetId}
          canPasteRegion={clipboard?.type==="graph"}
          onClose={() => setRightClickContext(null)}
          onCopyRegionSet={() => 
            setClipboard({ type: "regionSet", 
                regionSetId:rightClickContext.regionSetId,
                trackId:rightClickContext.trackId })}
          onPasteRegion={}
          onDetails={}
          onRemove={}
          onRename={}
          onCreateRegion={}
        />)

    case "track":
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

    default:
      return null;
  }
}