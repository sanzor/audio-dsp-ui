import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar";
import { RegionItem } from "./region-item";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import type { OpenedContext, SelectedContext } from "@/Providers/UIStore/UIStateProvider";
import type { RightClickContext } from "../dashboard";

interface Props {
  regionSet: TrackRegionSetViewModel;
  trackId: string;
  onRightClick: (ctx: RightClickContext) => void;
  onSelect: (ctx: SelectedContext) => void;
  onOpen:(ctx:OpenedContext)=>void;
}

export function RegionSetItem({ regionSet, trackId, onRightClick, onSelect, onOpen}: Props) {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            onClick={() => onSelect({ type: "regionSet", trackId, regionSetId: regionSet.id })}
            onDoubleClick={() => onOpen({ type: "regionSet", trackId, regionSetId: regionSet.id })}
            onContextMenu={e => {
              e.preventDefault();
              onRightClick({ type: "regionSet", trackId, regionSetId: regionSet.id, x: e.clientX, y: e.clientY });
            }}
          >
            {regionSet.name}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {regionSet.regions.map(region => (
              <RegionItem
                key={region.regionId}
                region={region}
                trackId={trackId}
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
