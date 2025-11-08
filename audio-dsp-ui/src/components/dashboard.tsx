import { useAuth } from "@/Auth/UseAuth";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams";
import type { AddTrackResult } from "@/Dtos/Tracks/AddTrackResult";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar-provider";
import { TrackCreateModal } from "./create-track-modal";
import { useTracks } from "@/Providers/UseTracks";
import { useAudioPlaybackCache } from "@/Providers/UsePlaybackCache";
import { WaveformPlayer } from "./waveform-player";
import { apiGetStoredTrack } from "@/Services/TracksService";
import type { SelectedContext } from "@/Providers/UIStateProvider";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { TrackController } from "./coordinators/track-controller";
import { useTrackMetaWithRegionsById, useTrackMetaWithRegionsList } from "@/Selectors/trackViewModels";

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
  const [selectedTrack, setSelectedTrack] = useState<TrackMetaWithRegions | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const { setBlob, getBlob } = useAudioPlaybackCache();
  const sidebarTracks = useTrackMetaWithRegionsList();
  const activeTrack = useTrackMetaWithRegionsById(
    selectedContext?.type === "track" ? selectedContext.trackId : null
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, navigate, user]);

  const hydrateTrack = useCallback(
    async (track: TrackMetaWithRegions) => {
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
    <SidebarProvider>
      <div className="flex">
        <AppSidebar
          tracks={sidebarTracks}
          onAddTrackClick={() => setAddTrackModalOpen(true)}
          onRightClick={setRightClickContext}
          onSelect={handleSelect}
        />

        <div className="grid grid-cols-[1fr_3fr] grid-rows-[1fr_auto] w-full h-screen">
          <div className="row-start-1 col-start-1 border-r bg-gray-50 p-4">
            <div className="font-semibold text-sm text-gray-700">Transform Store</div>
          </div>

          <div className="row-start-1 col-start-2 p-4 overflow-auto bg-white">
            <main>Main content here</main>
          </div>

          <div className="row-start-2 col-span-2 border-t p-4 bg-white shadow-inner">
            {selectedTrack && objectUrl && (
              <WaveformPlayer
                track={selectedTrack}
                url={objectUrl}
                onCreateRegionClick={() => null}
                onCreateRegionDrag={() => null}
                onRegionDetails={() => null}
                onEditRegion={() => null}
                onDeleteRegion={() => null}
              />
            )}
          </div>
        </div>

        <TrackCreateModal open={addTrackModalOpen} onClose={onCloseAddTrackModal} onSubmit={onSubmitAddTrackModal} />

        <TrackController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
      </div>
    </SidebarProvider>
  );
}
