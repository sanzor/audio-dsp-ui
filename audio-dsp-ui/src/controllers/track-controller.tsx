import { useMemo, useState } from "react";
import type { TrackMetaViewModel } from "@/Domain/Track/TrackMetaViewModel";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import type { RightClickContext } from "../components/dashboard/dashboard";
import { TrackContextMenu } from "../track-context-menu";
import { CreateRegionSetModal } from "../components/dashboard/modals/region-set/create-region-set-modal";
import { DetailsTrackModal } from "../components/dashboard/modals/track/details-track-modal";
import { TrackRenameModal } from "../components/dashboard/modals/track/rename-track-modal";
import { CopyTrackModal } from "../components/dashboard/modals/track/copy-track-modal";
import { CopyRegionSetModal } from "../components/dashboard/modals/region-set/copy-region-set-modal";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import { useCopyTrack, useDeleteTrack, useRenameTrack } from "@/Orchestrators/Tracks/useTrackMutations";
import { useCopyRegionSet, useCreateRegionSet } from "@/Orchestrators/RegionSets/useRegionSetsMutations";
import {  useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useUIState } from "@/Providers/UIStore/UseUIStateProvider";

type TrackControllerProps = {
  rightClickContext: RightClickContext | null;
  setRightClickContext: (ctx: RightClickContext | null) => void;
};

export function TrackController({ rightClickContext, setRightClickContext }: TrackControllerProps) {
  const trackViewModelMap = useTrackViewModelMap();
  const { clipboard } = useUIState();
  const deleteTrack = useDeleteTrack();
  const copyTrack = useCopyTrack();
  const renameTrack = useRenameTrack();
  const createRegionSet = useCreateRegionSet();
  const copyRegionSet = useCopyRegionSet();

  const [trackForDetails, setTrackForDetails] = useState<TrackMetaViewModel | null>(null);
  const [trackForRename, setTrackForRename] = useState<{ trackId: string; trackInitialName: string } | null>(null);
  const [trackToCopy, setTrackToCopy] = useState<{ trackId: string; sourceTrackNname: string } | null>(null);
  const [trackIdForRegionSet, setTrackIdForRegionSet] = useState<string | null>(null);
  const [regionSetPasteContext, setRegionSetPasteContext] = useState<{
    targetTrackId: string;
    sourceRegionSet: TrackRegionSetViewModel;
  } | null>(null);

  const trackMap = useTrackViewModelMap();
  const selectedTrackId = rightClickContext?.type === "track" ? rightClickContext.trackId : null;

  const clipboardRegionSet = useMemo(() => {
    if (clipboard?.type !== "regionSet") return null;
    const sourceTrack = trackViewModelMap.get(clipboard.trackId);
    if (!sourceTrack) return null;
    return sourceTrack.regionSets.find(set => set.id === clipboard.regionSetId) ?? null;
  }, [clipboard, trackViewModelMap]);

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
      sourceTrackNname: track.trackInfo.name,
    });
  };

  const handleRenameTrack = (trackId: string) => {
    const track = trackMap.get(trackId);
    if (!track) return;
    setTrackForRename({
      trackId,
      trackInitialName: track.trackInfo.name,
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

  const handlePasteRegionSet = (targetTrackId: string) => {
    if (!clipboardRegionSet) return;
    setRegionSetPasteContext({
      targetTrackId,
      sourceRegionSet: clipboardRegionSet,
    });
  };

  const submitPasteRegionSet = (targetTrackId: string, regionSetId: string, newName: string) => {
    copyRegionSet.mutate(
      {
        sourceTrackId: targetTrackId,
        sourceRegionSetId: regionSetId,
        copy_region_set_name: newName,
      },
      {
        onSettled: () => {
          setRegionSetPasteContext(null);
        },
      }
    );
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
          onPasteRegionSet={handlePasteRegionSet}
          canPasteRegionSet={Boolean(clipboardRegionSet)}
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

      {regionSetPasteContext && (
        <CopyRegionSetModal
          targetTrackId={regionSetPasteContext.targetTrackId}
          regionSetToCopy={regionSetPasteContext.sourceRegionSet}
          open
          onClose={() => setRegionSetPasteContext(null)}
          onPaste={submitPasteRegionSet}
        />
      )}
    </>
  );
}
