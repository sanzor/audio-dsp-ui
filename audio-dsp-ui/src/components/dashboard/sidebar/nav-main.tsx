"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import type { SelectedContext } from "@/Providers/UIStateProvider";
import type { RightClickContext } from "../dashboard";
import { TrackItem } from "./track-item";



interface NavMainProps {
  tracks: TrackMetaViewModel[];
  onSelect: (ctx: SelectedContext) => void;
  onRightClick: (ctx: RightClickContext) => void;
}

export function NavMain({ tracks, onSelect, onRightClick }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tracks</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map(track => (
          <TrackItem
            key={track.track_id}
            track={track}
            onSelect={onSelect}
            onRightClick={onRightClick}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}