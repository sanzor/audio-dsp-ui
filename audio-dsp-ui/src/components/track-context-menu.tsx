import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface TrackContextMenuProps{
  x: number;
  y: number;
  trackId: string;
  onClose:()=>void;
  onCreateRegionSet:(id:string)=>void
  onRemove: (id: string) => void
  onRename: (id: string) => void
  onCopy: (id: string) => void
  onDetails:(id:string)=>void
}

export function TrackContextMenu({
  x,
  y,
  trackId,
  onClose,
  onCreateRegionSet,
  onDetails,
  onRemove,
  onRename,
  onCopy,
}: TrackContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent
          style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}
          onClick={onClose}
        >   
        <ContextMenuItem onClick={() => {onCreateRegionSet(trackId); onClose()}}>Create Region Set</ContextMenuItem>
        <ContextMenuItem onClick={() => {onDetails(trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(trackId);onClose();}}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={() => {onCopy(trackId);onClose();}}>Copy</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRemove(trackId);onClose();}}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}