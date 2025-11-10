"use client";

import {
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import type { TrackRegionViewModel } from "@/Domain/Region/TrackRegionViewModel";
import type { RightClickContext } from "../dashboard";


interface RegionItemProps {
  region: TrackRegionViewModel;
  trackId: string;
  onRightClick: (ctx: RightClickContext) => void;
}

export function RegionItem({ region, trackId, onRightClick }: RegionItemProps) {
  return (
    <SidebarMenuSubItem
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
