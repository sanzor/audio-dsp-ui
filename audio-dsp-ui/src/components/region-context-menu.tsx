import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface RegionContextMenuProps{
  x: number;
  y: number;
  trackId: string;
  regionSetId:string,
  regionId:string,
  onClose:()=>void;
  onRemove: (regionId: string,regionSetId:string,trackId:string) => void
  onRename: (regionId: string,regionSetId:string,trackId:string) => void
  onCopy: (regionId: string,regionSetId:string,trackId:string) => void
  onDetails:(regionId: string,regionSetId:string,trackId:string)=>void
}

export function RegionContextMenu({
  x,
  y,
  trackId,
  regionId,
  regionSetId,
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
         <ContextMenuItem onClick={() => {onDetails(regionId,regionSetId,trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(regionId,regionSetId,trackId);onClose();}}>Rename</ContextMenuItem>
         <ContextMenuItem onClick={() => {onCopy(regionId,regionSetId,trackId);onClose();}}>Copy</ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(regionId,regionSetId,trackId);onClose();}}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}