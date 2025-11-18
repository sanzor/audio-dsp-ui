import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import type { OpenedContext, SelectedContext } from "@/Providers/UIStore/UIStateProvider";
import type { RightClickContext } from "../dashboard";
import { RegionSetItem } from "./region-set-item";

interface TrackItemProps {
  track: TrackMetaViewModel;
  onSelect: (ctx: SelectedContext) => void;
  onOpen:(ctx:OpenedContext)=>void;
  onRightClick: (ctx: RightClickContext) => void;
}

export function TrackItem({ track, onSelect,onOpen, onRightClick }: TrackItemProps) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
              onClick={() => onSelect({ type: "track", trackId: track.track_id })} 
              onDoubleClick={()=>onOpen({type:"track",trackId:track.track_id})}>
            <span className="truncate">{track.track_info.name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {track.regionSets.map(regionSet => (
              <RegionSetItem
                key={regionSet.id}
                regionSet={regionSet}
                trackId={track.track_id}
                onRightClick={onRightClick}
                onSelect={onSelect}
                onOpen={onOpen}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
