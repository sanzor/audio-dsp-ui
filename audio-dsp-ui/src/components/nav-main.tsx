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
import type { TrackRegion } from "@/Domain/TrackRegion"

import type { RightClickContext } from "./dashboard"

export interface NavMainProps{
   tracks:TrackMetaWithRegions[],
   onSelect:(trackId:string)=>void,
   onRightClick: (ctx: RightClickContext) => void
}
export function NavMain({
  tracks,
  onSelect,
  onRightClick

}:NavMainProps) {

  function TrackItem({track,onSelect,onRightClick}
    :{
      track: TrackMetaWithRegions,
      onSelect: (id: string) => void,
      onRightClick: (ctx: RightClickContext) => void}){
        return(
         <div className="track-item" 
          onClick={()=>onSelect(track.track_id)}
          onContextMenu={(e)=>{
            e.preventDefault();
            onRightClick({
              type:"track",
              trackId:track.track_id,
              y:e.clientY,
              x:e.clientX
            });
          }}>

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
                    <RegionItem 
                        trackId={track.track_id} 
                        onRightClick={onRightClick}
                        region={region}>
                    </RegionItem>)
                  }
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          {/* </TrackContextMenu> */}
          </div>
            );
   
  };
  function RegionItem({region,trackId,onRightClick}:{region:TrackRegion,trackId:string,onRightClick:(ctx:RightClickContext)=>void}){
    return (<SidebarMenuSubItem key={region.region_id}
            onContextMenu={(e)=>{
              e.preventDefault();
              onRightClick({
                type:"region",
                trackId,
                regionSetId:region.region_set_id,
                regionId:region.region_id,
                x:e.clientX,
                y:e.clientY
              })
            }}>
                <SidebarMenuSubButton asChild>
                          
                    <span>{region.name}</span>

                </SidebarMenuSubButton>
              </SidebarMenuSubItem>)
  }
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
