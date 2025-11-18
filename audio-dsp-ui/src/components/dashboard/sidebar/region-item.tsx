"use client";

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import type { RightClickContext } from "../dashboard";
import type { OpenedContext, SelectedContext } from "@/Providers/UIStore/UIStateProvider";


interface RegionItemProps {
  region: TrackRegionViewModel;
  trackId: string;
  onRightClick: (ctx: RightClickContext) => void;
  onSelect: (ctx: SelectedContext) => void;
  onOpen:(ctx:OpenedContext)=>void;
}

export function RegionItem({ region, trackId, onRightClick,onSelect,onOpen}: RegionItemProps) {
  return (
    <SidebarMenuSubItem
      onClick={()=>onSelect({type:"region",regionId:region.region_id,regionSetId:region.region_set_id,trackId})}
      onDoubleClick={()=>onOpen({type:"region",regionId:region.region_id,regionSetId:region.region_set_id,trackId})}
      onContextMenu={e => {
        e.preventDefault();
        onRightClick({
          type: "region",
          trackId,
          regionSetId: region.region_set_id,
          regionId: region.region_id,
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      <SidebarMenuSubButton asChild>
        <span>{region.name}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
