import {  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../ui/context-menu"

interface WaveformTimelineContextMenuProps{
  x: number;
  y: number;
  regionSetId:string,
  time:number,
  onCreateRegionClick:(regionSetId:string)=>void;
  onCreateRegionDrag:(regionSetId:string,time:number)=>void;
  onClose:()=>void;
}

export function WaveformTimelineContextMenu({
  x,
  y,
  time,
  regionSetId,
  onCreateRegionClick,
  onCreateRegionDrag,
  onClose 
}: WaveformTimelineContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
        <ContextMenuItem onClick={() => {onCreateRegionClick(regionSetId);onClose()}}>Create Region</ContextMenuItem>
        <ContextMenuItem
            onClick={() =>
              onCreateRegionDrag(regionSetId,Math.max(0, time - 1), time + 1)
            }
          
        >
          Paste Graph
        </ContextMenuItem>
         <ContextMenuItem onClick={() => {onRemove(regionId);onClose();}}>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

