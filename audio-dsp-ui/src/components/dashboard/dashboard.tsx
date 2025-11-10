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
import { WaveformPlayer } from "../waveform-player";
import { apiGetStoredTrack } from "@/Services/TracksService";
import type { SelectedContext } from "@/Providers/UIStateProvider";
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

export type RightClickContext =
  | { type: "track"; trackId: string; x: number; y: number }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string; x: number; y: number }
  | { type: "regionSet"; trackId: string; regionSetId: string; x: number; y: number }
  | null;

export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { addTrack } = useTracks();
  const { selectedContext, setSelectedContext } = useUIState();

  const [rightClickContext, setRightClickContext] = useState<RightClickContext>(null);
  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackMetaViewModel | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { setBlob, getBlob } = useAudioPlaybackCache();
  const sidebarTracks = useTrackViewModels();
  const activeTrack = useTrackViewModelById(
    selectedContext?.type === "track" ? selectedContext.trackId : null
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, navigate, user]);

  const hydrateTrack = useCallback(
    async (track: TrackMetaViewModel) => {
      setSelectedTrack(track);

      let blob = getBlob(track.track_id);
      if (!blob) {
        try {
          const response = await apiGetStoredTrack({ track_id: track.track_id });
          blob = response.blob;
          setBlob(track.track_id, blob);
        } catch (error) {
          console.error("Failed to fetch audio blob", error);
          return;
        }
      }

      const url = URL.createObjectURL(blob);
      setObjectUrl(current => {
        if (current) URL.revokeObjectURL(current);
        return url;
      });
    },
    [getBlob, setBlob]
  );

  useEffect(() => {
    if (!selectedContext || selectedContext.type !== "track" || !activeTrack) return;
    hydrateTrack(activeTrack).catch(() => null);
  }, [activeTrack, hydrateTrack, selectedContext]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleSelect = (ctx: SelectedContext) => {
    setSelectedContext(ctx);
  };

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
              selectedTrack && objectUrl ? (
                <WaveformPlayer
                  track={selectedTrack}
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