import { Folder } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import { useEffect } from "react";


export interface NaveProjectsProps{
  tracks:TrackMetaViewModel[],
  onRemoveTrack:(trackId:number)=>void

}
export function NavProjects({tracks}:NaveProjectsProps) {
  function TrackSidebarItem({track}:{track:TrackMetaViewModel}){
  return(
     <SidebarMenuItem key={track.track_id}>
      <SidebarMenuButton asChild>
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4" />
          <span>{track.track_info.name}</span>
        </div>
      </SidebarMenuButton>
      <SidebarMenu className="ml-4">
        {track.regions.map((region) => (
          <SidebarMenuItem key={region.region_id}>
            <SidebarMenuButton asChild>
              <a href={`/track/${track.track_id}/region/${region.region_id}`}>
                <span className="text-sm text-muted-foreground hover:text-foreground">
                  {region.name}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarMenuItem>);
}
  useEffect(() => {
  console.log("📦 tracks updated:", tracks);
}, [tracks]); // ✅ fixed-size dependency list
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map((track) => {
          console.log("🎯 Rendering track:", track);
          return <TrackSidebarItem key={track.track_id} track={track} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

