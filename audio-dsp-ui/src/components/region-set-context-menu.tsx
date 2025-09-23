import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface RegionSetContextMenuProps{
  x: number;
  y: number;
  trackId: string;
  regionSetId:string,
  onClose:()=>void;
  onCreateRegion:(id:string)=>void
  onRemove: (id: string) => void
  onRename: (id: string) => void
  onCopy: (id: string) => void
  onDetails:(id:string)=>void
}

export function RegionSetContextMenu({
  x,
  y,
  trackId,
  onClose,
  onCreateRegion,
  onDetails,
  onRemove,
  onRename,
  onCopy,
}: RegionSetContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
        <ContextMenuItem onClick={() => {onCreateRegion(trackId); onClose()}}>Create Region</ContextMenuItem>
         <ContextMenuItem onClick={() => {onDetails(trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(trackId);onClose();}}>Rename</ContextMenuItem>
         <ContextMenuItem onClick={() => {onCopy(trackId);onClose();}}>Copy</ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(trackId);onClose();}}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}