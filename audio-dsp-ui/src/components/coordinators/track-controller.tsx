import { useMemo, useState } from "react";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import type { RightClickContext } from "../dashboard";
import { TrackContextMenu } from "../track-context-menu";
import { CreateRegionSetModal } from "../modals/create-region-set-modal";
import { DetailsTrackModal } from "../modals/details-track-modal";
import { TrackRenameModal } from "../modals/rename-track-modal";
import { CopyTrackModal } from "../modals/copy-track-modal";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import { useCopyTrack, useDeleteTrack, useRenameTrack } from "@/Orchestrators/Tracks/useTrackMutations";
import { useCreateRegionSet } from "@/Orchestrators/RegionSets/useRegionSetsMutations";
import { useTrackMetaWithRegionsList } from "@/Selectors/trackViewModels";

type TrackControllerProps = {
  rightClickContext: RightClickContext | null;
  setRightClickContext: (ctx: RightClickContext | null) => void;
};

export function TrackController({ rightClickContext, setRightClickContext }: TrackControllerProps) {
  const tracks = useTrackMetaWithRegionsList();
  const deleteTrack = useDeleteTrack();
  const copyTrack = useCopyTrack();
  const renameTrack = useRenameTrack();
  const createRegionSet = useCreateRegionSet();

  const [trackForDetails, setTrackForDetails] = useState<TrackMetaWithRegions | null>(null);
  const [trackForRename, setTrackForRename] = useState<{ trackId: string; trackInitialName: string } | null>(null);
  const [trackToCopy, setTrackToCopy] = useState<{ trackId: string; sourceTrackNname: string } | null>(null);
  const [trackIdForRegionSet, setTrackIdForRegionSet] = useState<string | null>(null);

  const trackMap = useMemo(() => new Map(tracks.map(track => [track.track_id, track])), [tracks]);
  const selectedTrackId = rightClickContext?.type === "track" ? rightClickContext.trackId : null;

  const closeContextMenu = () => setRightClickContext(null);

  const handleCreateRegionSet = (trackId: string) => {
    setTrackIdForRegionSet(trackId);
  };

  const handleDeleteTrack = (trackId: string) => {
    deleteTrack.mutate(
      { trackId },
      {
        onSettled: () => {
          closeContextMenu();
        },
      }
    );
  };

  const handleCopyTrack = (trackId: string) => {
    const track = trackMap.get(trackId);
    if (!track) return;
    setTrackToCopy({
      trackId,
      sourceTrackNname: track.track_info.name,
    });
  };

  const handleRenameTrack = (trackId: string) => {
    const track = trackMap.get(trackId);
    if (!track) return;
    setTrackForRename({
      trackId,
      trackInitialName: track.track_info.name,
    });
  };

  const handleDetails = (trackId: string) => {
    const track = trackMap.get(trackId);
    if (!track) return;
    setTrackForDetails(track);
  };

  const submitRename = (trackId: string, newName: string) => {
    renameTrack.mutate(
      { trackId, newName },
      {
        onSettled: () => {
          setTrackForRename(null);
        },
      }
    );
  };

  const submitCopy = (trackId: string, copyName: string) => {
    copyTrack.mutate(
      { track_id: trackId, copy_track_name: copyName },
      {
        onSettled: () => {
          setTrackToCopy(null);
        },
      }
    );
  };

  const submitCreateRegionSet = (payload: CreateRegionSetParams) => {
    createRegionSet.mutate(payload, {
      onSettled: () => {
        setTrackIdForRegionSet(null);
      },
    });
  };

  const closeCreateRegionSetModal = () => {
    setTrackIdForRegionSet(null);
    closeContextMenu();
  };

  const closeDetailsModal = () => {
    setTrackForDetails(null);
    closeContextMenu();
  };

  return (
    <>
      {selectedTrackId && (
        <TrackContextMenu
          x={rightClickContext?.x ?? 0}
          y={rightClickContext?.y ?? 0}
          trackId={selectedTrackId}
          onClose={closeContextMenu}
          onCreateRegionSet={handleCreateRegionSet}
          onDetails={handleDetails}
          onCopy={handleCopyTrack}
          onRename={handleRenameTrack}
          onRemove={handleDeleteTrack}
        />
      )}

      {trackIdForRegionSet && (
        <CreateRegionSetModal
          trackId={trackIdForRegionSet}
          open
          onClose={closeCreateRegionSetModal}
          onSubmit={submitCreateRegionSet}
        />
      )}

      {trackForDetails && (
        <DetailsTrackModal track={trackForDetails} open onClose={closeDetailsModal} />
      )}

      {trackForRename && (
        <TrackRenameModal
          trackToRename={trackForRename}
          open
          onClose={() => setTrackForRename(null)}
          onSubmit={submitRename}
        />
      )}

      {trackToCopy && (
        <CopyTrackModal
          trackToCopy={trackToCopy}
          open
          onClose={() => setTrackToCopy(null)}
          onSubmit={submitCopy}
        />
      )}
    </>
  );
}
