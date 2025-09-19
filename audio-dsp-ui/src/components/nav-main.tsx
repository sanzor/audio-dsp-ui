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
import { TrackContextMenu } from "./track-context-menu"

export interface NavMainProps{
   tracks:TrackMetaWithRegions[],
   onSelect:(trackId:string)=>void,
   onCreateRegionSet:(trackId:string)=>void,
   onDetails:(trackId:string)=>void,
   onRename:(trackId:string)=>void,
   onRemove:(trackId:string)=>void,
   onCopy:(trackId:string)=>void
   onPaste:()=>void
}
export function NavMain({
  tracks,
  onCreateRegionSet,
  onDetails,
  onRename,
  onCopy,
  onPaste,
  onRemove,
  onSelect

}:NavMainProps) {
  const handleDetails=(trackId:string)=>{
    onDetails(trackId);
  }
  const handleRename=(trackId:string)=>{
    console.log("rename clicked from nav main");
      onRename(trackId)
    }
  const handleRemove=(trackId:string)=>{
    onRemove(trackId)
  }
  const handleCopy=(trackId:string)=>{
    onCopy(trackId);
  }
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onPaste();
  };
  const handleCreateRegionSet=(trackId:string)=>{
    onCreateRegionSet(trackId);
  }
  function TrackItem({track}:{track:TrackMetaWithRegions}){
        return(
         <div className="track-item" onClick={()=>onSelect(track.track_id)}>
          <TrackContextMenu

          trackId={track.track_id}
          onCreateRegionSet={handleCreateRegionSet}
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
          </div>
            );
   
  };
  function RegionItem({region}:{region:TrackRegion}){
    return (<SidebarMenuSubItem key={region.region_id}>
                      <SidebarMenuSubButton asChild>
                        
                          <span>{region.name}</span>

                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>)
  }
  return (
    <SidebarGroup onContextMenu={handleContextMenu}>
      <SidebarGroupLabel>Tracks</SidebarGroupLabel>
      <SidebarMenu>
        {tracks.map((item) => (<TrackItem  key={item.track_id} track={item}></TrackItem>))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
