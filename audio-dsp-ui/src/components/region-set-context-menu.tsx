import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"

interface RegionSetContextMenuProps{
  x: number;
  y: number;
  trackId: string;
  regionSetId:string,
  onClose:()=>void;
  onCreateRegion:(regionSetId:string,trackId:string)=>void
  onRemove: (regionSetId: string,trackId:string) => void
  onRename: (regionSetId: string,trackId:string) => void
  onCopy: (regionSetId: string,trackId:string) => void
  onPaste:(regionSetId:string,trackId:string)=>void
  canPaste:boolean
  onDetails:(regionSetId:string,trackId:string)=>void
}

export function RegionSetContextMenu({
  x,
  y,
  trackId,
  regionSetId,
  onClose,
  onCreateRegion,
  onDetails,
  onRemove,
  onRename,
  onCopy,
  onPaste,
  canPaste
}: RegionSetContextMenuProps) {
   
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
        <ContextMenuItem onClick={() => {onCreateRegion(regionSetId,trackId); onClose()}}>Create Region</ContextMenuItem>
         <ContextMenuItem onClick={() => {onDetails(regionSetId,trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(regionSetId,trackId);onClose();}}>Rename</ContextMenuItem>
         <ContextMenuItem onClick={() => {onCopy(regionSetId,trackId);onClose();}}>Copy</ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(regionSetId,trackId);onClose();}}>Delete</ContextMenuItem>
         <ContextMenuItem disabled={canPaste} onClick={()=>onPaste(regionSetId,trackId)}>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}