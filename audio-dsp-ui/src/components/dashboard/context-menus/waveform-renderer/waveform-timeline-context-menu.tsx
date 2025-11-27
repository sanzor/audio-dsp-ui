import { ContextMenu, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";


interface WaveformTimelineContextMenuProps{
  regionSetId:string,
  x: number;
  y: number;
  time:number,
  onCreateRegionClick:(regionSetId:string,time:number)=>void;
  onCreateRegionDrag:(regionSetId:string,time:number)=>void;
  onClose:()=>void;
}

export function WaveformTimelineContextMenu({
  regionSetId,
  x,
  y,
  time,
  onCreateRegionClick,
  onClose 
}: WaveformTimelineContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger></ContextMenuTrigger>
       <ContextMenuContent style={{ position: "absolute", top: y, left: x, zIndex: 1000 }} onClick={onClose}>   
        <ContextMenuItem onClick={() => {
          onCreateRegionClick(regionSetId,time);
          onClose()}}>Create Region</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

