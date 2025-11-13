import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../ui/context-menu"

interface GraphContextMenuProps{
  x: number;
  y: number;
  trackId:string,
  regionSetId:string,
  regionId: string;
  graphId:string,
  onClose:()=>void;
  onRemove: (regionSetId: string,trackId:string,regionId:string,graphId:string) => void
  onRename: (regionSetId: string,trackId:string,regionId:string,graphId:string) => void
  onCopy: (regionSetId: string,trackId:string,regionId:string,graphId:string) => void
  canPaste:boolean
  onDetails:(regionSetId:string,trackId:string)=>void
}

export function GraphContextMenu({
  x,
  y,
  trackId,
  regionSetId,
  regionId,
  graphId,
  onClose,
  onDetails,
  onRemove,
  onRename,
  onCopy
}: GraphContextMenuProps) {
   
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
         <ContextMenuItem onClick={() => {onDetails(regionSetId,trackId);onClose()}}>Details</ContextMenuItem>
        <ContextMenuItem onClick={() => {onRename(regionSetId,trackId,regionId,graphId);onClose();}}>Rename</ContextMenuItem>
         <ContextMenuItem onClick={() => {onCopy(regionSetId,trackId,regionId,graphId);onClose();}}>Copy</ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(regionSetId,trackId,regionId,graphId);onClose();}}>Delete</ContextMenuItem>
         
      </ContextMenuContent>
    </ContextMenu>
  );
}
