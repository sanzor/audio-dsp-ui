// dashboard.trackModalHandlers.ts
import { useCallback } from "react";
import { apiCopyTrack } from "@/Services/TracksService";
import type { CopyTrackParams } from "@/Dtos/Tracks/CopyTrackParams";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";

export function useTrackModalHandlers({
  tracks,
  setTrackToRename,
  setRenameTrackModalOpen,
  setCopyTrackModalOpen,
  setDetailsTrackModalOpen,
}: {
  tracks: TrackMetaWithRegions[];
  setTrackToRename: React.Dispatch<
    React.SetStateAction<{ trackId: string; trackInitialName: string } | null>
  >;
  setRenameTrackModalOpen: (open: boolean) => void;
  setCopyTrackModalOpen: (open: boolean) => void;
  setDetailsTrackModalOpen:(open:boolean)=>void;
}) {
  const onSubmitCopyTrackModal = useCallback(
    async (trackId: string, copyTrackName: string) => {
      const params: CopyTrackParams = { copy_track_name: copyTrackName, track_id: trackId };
      const result = await apiCopyTrack(params);
      setCopyTrackModalOpen(false);
      return result;
    },
    [setCopyTrackModalOpen]
  );

  const onCloseCopyTrackModal = useCallback(() => {
    setCopyTrackModalOpen(false);
  }, [setCopyTrackModalOpen]);

  const onRenameTrackClick = useCallback(
    (trackId: string) => {
      const targetTrack = tracks.find(x => x.track_id === trackId);
      if (!targetTrack) return;

      setTrackToRename({ trackId, trackInitialName: targetTrack.track_info.name });
      setRenameTrackModalOpen(true);
    },
    [tracks, setTrackToRename, setRenameTrackModalOpen]
  );

  return {
    onSubmitCopyTrackModal,
    onCloseCopyTrackModal,
    onRenameTrackClick,
  };
}