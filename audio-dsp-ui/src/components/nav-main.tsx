"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel"
import type { SelectedContext } from "@/Providers/UIStateProvider"
import type { RightClickContext } from "./dashboard/dashboard"
import { TrackItem } from "./dashboard/sidebar/track-item"

export interface NavMainProps{
   tracks:TrackMetaViewModel[],
   onSelect:(ctx: SelectedContext)=>void,
   onRightClick: (ctx: RightClickContext) => void
}
export function NavMain({
  tracks,
  onSelect,
  onRightClick

}:NavMainProps) {


    return (
    <SidebarGroup>
      <SidebarGroupLabel>Tracks</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map((item) => (
          <TrackItem
            key={item.track_id}
            track={item}
            onSelect={onSelect}
            onRightClick={onRightClick}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
