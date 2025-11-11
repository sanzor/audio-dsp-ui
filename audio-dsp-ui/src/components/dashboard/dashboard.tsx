import { useAuth } from "@/Auth/UseAuth";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams";
import type { AddTrackResult } from "@/Dtos/Tracks/AddTrackResult";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarProvider } from "../ui/sidebar-provider";

import { useTracks } from "@/Providers/UseTracks";
import { useAudioPlaybackCache } from "@/Providers/UsePlaybackCache";
import { WaveformRenderer } from "./waveform/WaveformPlayer";
import { apiGetStoredTrack } from "@/Services/TracksService";
import type { OpenedContext, SelectedContext } from "@/Providers/UIStateProvider";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { TrackController } from "../coordinators/track-controller";
import { useTrackViewModelById, useTrackViewModels } from "@/Selectors/trackViewModels";
import { CreateTrackModal } from "../modals/create-track-modal";
import { RegionSetController } from "../coordinators/region-set-controller";
import { RegionController } from "../coordinators/region-controller";
import { DashboardLayout } from "./dashboard-layout";
import { TransformStorePanel } from "./store/transform-store-panel";
import { CanvasPanel } from "./graph/canvas-panel";
import { SidebarInset } from "../ui/sidebar";
import { useWaveformAudio } from "./waveform/WaveformAudio";

export type RightClickContext =
  | { type: "track"; trackId: string; x: number; y: number }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string; x: number; y: number }
  | { type: "regionSet"; trackId: string; regionSetId: string; x: number; y: number }
  | null;


export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { addTrack } = useTracks();
  const {
    setSelectedContext,
    openedContext,
    setOpenedContext
  } = useUIState();

  const openedTrackId =
  openedContext ? openedContext.trackId : null;

  const openedRegionSetId =
    openedContext && openedContext.type !== "track"
      ? openedContext.regionSetId
      : null;

  // const openedRegionId =
  //   openedContext && openedContext.type === "region"
  //     ? openedContext.regionId
  //     : null;

  const [rightClickContext, setRightClickContext] = useState<RightClickContext>(null);
  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);
  const {objectUrl} =useWaveformAudio()


  const sidebarTracks = useTrackViewModels();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, navigate, user]);






  const handleSelect = (ctx: SelectedContext) => {
    setSelectedContext(ctx);
  };
  const handleOpen=(ctx:OpenedContext)=>{
    setOpenedContext(ctx);
  }

  const onSubmitAddTrackModal = async (data: AddTrackParams): Promise<AddTrackResult> => {
    const result = await addTrack(data);
    setAddTrackModalOpen(false);
    return result;
  };

  const onCloseAddTrackModal = () => setAddTrackModalOpen(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar - fixed width */}
        <AppSidebar
          tracks={sidebarTracks}
          onAddTrackClick={() => setAddTrackModalOpen(true)}
          onRightClick={setRightClickContext}
          onSelect={handleSelect}
          onOpen={handleOpen}
          user={{
            name: user?.name ?? "Unknown User",
            email: user?.email ?? "",
            avatar: user?.photo ?? "/default-avatar.png",
          }}
          teams={[
            { name: "My Workspace", logo: () => null, plan: "Free" },
          ]}
        />

        {/* Main content - takes remaining space */}
        <SidebarInset className="flex-1 overflow-hidden">
          <DashboardLayout
            store={<TransformStorePanel />}
            canvas={<CanvasPanel />}
            waveform={
               objectUrl &&openedTrackId && openedRegionSetId ? (
                <WaveformRenderer
                  trackId={openedTrackId}
                  regionSetId={openedRegionSetId}
                  url={objectUrl}
                  onCreateRegionClick={() => null}
                  onCreateRegionDrag={() => null}
                  onRegionDetails={() => null}
                  onEditRegion={() => null}
                  onDeleteRegion={() => null}
                />
              ) : null
            }
          />
        </SidebarInset>
      </div>

      <CreateTrackModal open={addTrackModalOpen} onClose={onCloseAddTrackModal} onSubmit={onSubmitAddTrackModal} />
      <TrackController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
      <RegionSetController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
      <RegionController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
    </SidebarProvider>
  );
}


