import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface RegionContextMenuProps{
  x: number;
  y: number;
  trackId: string;
  regionSetId:string,
  regionId:string,
  onClose:()=>void;
  onRemove: (id: string) => void
  onRename: (id: string) => void
  onCopy: (id: string) => void
  onDetails:(id:string)=>void
}

export function RegionContextMenu({
  x,
  y,
  trackId,
  onClose,
  onDetails,
  onRemove,
  onRename,
  onCopy,
}: RegionContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
         <ContextMenuItem onClick={() => {onDetails(trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(trackId);onClose();}}>Rename</ContextMenuItem>
         <ContextMenuItem onClick={() => {onCopy(trackId);onClose();}}>Copy</ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(trackId);onClose();}}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}