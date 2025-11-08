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
import type { RightClickContext } from "./dashboard"
import type { SelectedContext } from "@/Providers/UIStateProvider"

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
export interface AppSidebarProps {
  tracks: TrackMetaWithRegions[];
  onAddTrackClick: () => void;
  onRightClick: (context: RightClickContext) => void;
  onSelect: (ctx: SelectedContext) => void;
}

export function AppSidebar({
  tracks,
  onAddTrackClick,
  onRightClick,
  onSelect,
}: AppSidebarProps) {
  const handleSelectTrack = (trackId: string) => {
    onSelect({ type: "track", trackId });
  };

  const handleRightClick = (context: RightClickContext) => {
    onRightClick(context);
  };
  return (

    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2">
          <Button
           onClick={onAddTrackClick}
           className="w-full justify-left bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm rounded-md !bg-green-600 !text-white">
          <Plus className="mr-2 h-5 w-5" />
          Add Track
        </Button>
        </div>
        <NavMain 
        onRightClick={handleRightClick}
        onSelect={onSelect}
        tracks={tracks} />
        {/* <NavProjects tracks={tracks} onRemoveTrack={removeTrack} /> ✅ Here */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />

    </Sidebar>
  )
}
