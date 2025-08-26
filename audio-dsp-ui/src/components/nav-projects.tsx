import { Folder } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";


export interface NaveProjectsProps{
  tracks:TrackMetaWithRegions[],
  onRemoveTrack:(trackId:number)=>void

}
export function NavProjects({tracks}:NaveProjectsProps) {


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map((track) => (
          <SidebarMenuItem key={track.id}>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                <span>{track.name}</span>
              </div>
            </SidebarMenuButton>

            {/* Nested Regions */}
            <SidebarMenu className="ml-4">
              {track.regions.map((region) => (
                <SidebarMenuItem key={region.region_id}>
                  <SidebarMenuButton asChild>
                    <a href={`/track/${track.id}/region/${region.region_id}`}>
                      <span className="text-sm text-muted-foreground hover:text-foreground">
                        {region.name}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
