import * as React from "react"
import {
  AudioWaveform,
  Command,

  GalleryVerticalEnd,

  Plus,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions"
import { Button } from "./ui/button"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Adaw Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Tracks",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    }
  ],
  projects: [
  ],
}
export interface AppSidebarProps{
  tracks: TrackMetaWithRegions[],                         // <- or with regions if needed
  onAddTrackClick: () => void,
  onSelect:(trackId:string)=>void,
  onDetailTrack:(trackId:string)=>void,
  onRemoveTrack: (trackId: string) => void,
  onRenameTrack:(trackId:string)=>void,
  onCopyTrack:(trackId:string)=>void;
  onPasteTrack:()=>void
};

export function AppSidebar({ tracks,onAddTrackClick: onAddTrack,onDetailTrack, onCopyTrack,onRemoveTrack,onRenameTrack,onPasteTrack,onSelect }:AppSidebarProps) {
  const selectTrack=(trackId:string)=>{
      onSelect(trackId);
  }
  const addTrackClick=():void=>{
      onAddTrack();
  };
  const detailsTrack=(elem:string)=>{
      onDetailTrack(elem);
  }
  const removeTrack=(elem:string)=>{
      onRemoveTrack(elem);
  }
  const renameTrack=(elem:string)=>{
     onRenameTrack(elem);
  }

  const copyTrack=(elem:string)=>{
    onCopyTrack(elem);
  }
  const pasteTrack=()=>{
    onPasteTrack();
  }
  React.useEffect(()=>{
    console.log("Tracks from app-sidebar",tracks);
  },[tracks])
  return (

    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2">
          <Button
           onClick={addTrackClick}
           className="w-full justify-left bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm rounded-md !bg-green-600 !text-white">
          <Plus className="mr-2 h-5 w-5" />
          Add Track
        </Button>
        </div>
        <NavMain onSelect={selectTrack} onPaste={pasteTrack} onDetails={detailsTrack} onRemove={removeTrack} onRename={renameTrack} onCopy={copyTrack} tracks={tracks} />
        {/* <NavProjects tracks={tracks} onRemoveTrack={removeTrack} /> ✅ Here */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
