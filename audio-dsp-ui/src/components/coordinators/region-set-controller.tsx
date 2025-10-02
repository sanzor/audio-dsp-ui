// RegionSetController.tsx
import { useEffect, useState } from "react";

import { RegionSetContextMenu } from "../region-set-context-menu";
import { CreateRegionSetModal } from "../modals/create-region-set-modal";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets } from "@/Providers/UseRegionSets";
import { apiCreateRegionSet } from "@/Services/RegionSetsService";
import { error } from "console";
import type { RightClickContext } from "../dashboard";
import { DetailsRegionSetModal } from "../modals/details-region-set-modal";
import { useTracks } from "@/Providers/UseTracks";

type RegionSetsControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function RegionSetController({
  rightClickContext,
  setRightClickContext,
}: RegionSetsControllerProps) {
  const { removeRegionSet,trackRegionSetsMap } = useRegionSets();
  const { tracks } = useTracks();

  const [createRegionSetModalOpen, setCreateRegionSetModalOpen] = useState(false);

  const [detailsRegionSetModalOpen, setDetailsRegionSetModalOpen] = useState(false);
  const [detailedRegionSet, setDetailedRegionSet] = useState<TrackRegionSet | null>(null);

  const [copyRegionSetModalOpen, setCopyRegionSetModalOpen] = useState(false);
  const [copiedRegionSet, setCopiedRegionSet] = useState<TrackRegionSet | null>(null);

  // handlers

  //create
  const onCreateRegionSetClick = (trackId: string) => {
    const track = tracks.find((x) => x.track_id === trackId);
    if (!track) {
      error("Could not find track");
      return;
    }
    setCreateRegionSetModalOpen(true);
  };

  const onSubmitCreateRegionSetModal = async (params: CreateRegionSetParams) => {
    await apiCreateRegionSet({ name: params.name, track_id: params.track_id });
    setCreateRegionSetModalOpen(false);
    setRightClickContext(null);
  };

  const onCloseCreateRegionSetModal = () => {
    setCreateRegionSetModalOpen(false);
    setRightClickContext(null);
  };


  //details
  const onDetailsRegionSetClick = (regionSetId: string, trackId: string) => {
    const track = tracks.find((x) => x.track_id === trackId);
    if (!track) {
      error(`Could not find track ${trackId}`);
      return;
    }
    const regionSets = trackRegionSetsMap.get(track.track_id);
    if (!regionSets) {
      error("Could not find region sets");
      return;
    }
    const regionSet = regionSets.find((x) => x.region_set_id === regionSetId);
    if (!regionSet) {
      error(`Could not find region set ${regionSetId}`);
      return;
    }
    setDetailedRegionSet(regionSet);
    setDetailsRegionSetModalOpen(true);
  };

  const onCloseDetailsRegionSetModal=()=>{
    setDetailedRegionSet(null);
    setDetailsRegionSetModalOpen(false);
  }
  //copy
  
    useEffect(() => {
      setCopiedRegionSet(copiedRegionSet);
      }, [copiedRegionSet, open]);
  
  const onCopyRegionSetClick = (regionSetId: string, trackId: string) => {
    const track = tracks.find((x) => x.track_id === trackId);
    if (!track) {
      error(`Could not find track ${trackId}`);
      return;
    }
    const regionSets = trackRegionSetsMap.get(track.track_id);
    if (!regionSets) {
      error("Could not find region sets");
      return;
    }
    const regionSet = regionSets.find((x) => x.region_set_id === regionSetId);
    if (!regionSet) {
      error(`Could not find region set ${regionSetId}`);
      return;
    }
    setCopiedRegionSet(regionSet);
  };

   const onPasteRegionSetClick=()=>{
    console.log("inside paste");
    if(!copiedRegionSet){
      return undefined;
    }
    setCopyRegionSetModalOpen(true);
  };

  const onRemoveRegionSetClick = async (regionSetId: string) => {
    await removeRegionSet({ region_set_id: regionSetId });
  };

  // (you can add rename handlers here later)

  return (
    <>
      {/* Context menu */}
      {rightClickContext?.type === "regionSet" && (
        <RegionSetContextMenu
          trackId={rightClickContext.trackId}
          regionSetId={rightClickContext.regionSetId}
          onClose={() => setRightClickContext(null)}
          x={rightClickContext.x}
          y={rightClickContext.y}
          onCreateRegion={onCreateRegionSetClick}
          onDetails={onDetailsRegionSetClick}
          onCopy={onCopyRegionSetClick}
          onRemove={onRemoveRegionSetClick}
          onRename={() => {
            // TODO: hook up rename
          }}
        />
      )}

      {/* Modals */}
      {rightClickContext?.type === "regionSet" && (
        <CreateRegionSetModal
          trackId={rightClickContext.trackId}
          open={createRegionSetModalOpen}
          onClose={onCloseCreateRegionSetModal}
          onSubmit={onSubmitCreateRegionSetModal}
        />
      )}
       { detailedRegionSet && (rightClickContext?.type === "regionSet") &&
        <DetailsRegionSetModal
          regionSet={detailedRegionSet}
          open={detailsRegionSetModalOpen}
          onClose={onCloseDetailsRegionSetModal}
        />
      }

      {/* TODO: add DetailsRegionSetModal + CopyRegionSetModal here */}
    </>
  );
}
