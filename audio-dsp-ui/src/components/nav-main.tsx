"use client"

import { ChevronRight} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions"
import type { Region } from "@/Domain/Region"
import { TrackContextMenu } from "./track-context-menu"

export interface NavMainProps{
   tracks:TrackMetaWithRegions[],
   onDetails:(trackId:string)=>void,
   onRename:(trackId:string)=>void,
   onRemove:(trackId:string)=>void,
   onCopy:(trackId:string)=>void
}
export function NavMain({
  tracks,
  onDetails,
  onRename,
  onCopy,
  onRemove

}:NavMainProps) {
  const handleDetails=(trackId:string)=>{
    onDetails(trackId);
  }
  const handleRename=(trackId:string)=>{
      onRename(trackId)
    }
  const handleRemove=(trackId:string)=>{
    onRemove(trackId)
  }
  const handleCopy=(trackId:string)=>{
    onCopy(trackId);
  }
  function TrackItem({track}:{track:TrackMetaWithRegions}){
        return(
          <TrackContextMenu
          trackId={track.track_id}
          onDetails={handleDetails}
          onRename={handleRename}
          onCopy={handleCopy}
          onRemove={handleRemove}>
          <Collapsible
            key={track.track_id}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={track.track_info.name}>
                  <span className="truncate">{track.track_info.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {track.regions.map((region) => 
                    <RegionItem region={region}>
                    </RegionItem>)
                  }
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          </TrackContextMenu>
            );
   
  };
  function RegionItem({region}:{region:Region}){
    return (<SidebarMenuSubItem key={region.region_id}>
                      <SidebarMenuSubButton asChild>
                        
                          <span>{region.name}</span>

                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>)
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tracks</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map((item) => (<TrackItem key={item.track_id} track={item}></TrackItem>))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
