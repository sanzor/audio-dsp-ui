
// RegionSetController.tsx
import { useState } from "react";

import { RegionSetContextMenu } from "../dashboard/context-menus/region-set-context-menu";
import type { TrackRegionSetViewModel } from "@/Domain/RegionSet/TrackRegionSetViewModel";
import type { RightClickContext } from "../dashboard/dashboard";
import { DetailsRegionSetModal } from "../dashboard/modals/region-set/details-region-set-modal";
import { RegionSetRenameModal } from "../dashboard/modals/region-set/rename-region-set-modal";
import { PasteRegionModal } from "../dashboard/modals/region/paste-region-modal";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";
import { CreateRegionModal } from "../dashboard/modals/region/create-region-modal";
import { useUIState } from "@/Providers/UseUIStateProvider";
import { useTrackViewModelMap } from "@/Selectors/trackViewModels";
import { useCopyRegion, useCreateRegion } from "@/Orchestrators/Regions/useRegionMutations";
import { useDeleteRegionSet, useRenameRegionSet } from "@/Orchestrators/RegionSets/useRegionSetsMutations";

type RegionSetsControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function RegionSetController({
  rightClickContext,
  setRightClickContext,
}: RegionSetsControllerProps) {
  const { clipboard, setClipboard } = useUIState();
  const trackMap = useTrackViewModelMap();
  const createRegionMutation = useCreateRegion();
  const copyRegionMutation = useCopyRegion();
  const deleteRegionSet = useDeleteRegionSet();
  const renameRegionSet = useRenameRegionSet();

  const [regionSetForCreateRegion, setRegionSetForCreateRegion] = useState<{ trackId: string; regionSetId: string } | null>(null);
  const [detailedRegionSet, setDetailedRegionSet] = useState<TrackRegionSetViewModel | null>(null);
  const [regionSetToRename, setRegionSetToRename] = useState<TrackRegionSetViewModel | null>(null);
  const [regionSetForPasteRegion, setRegionSetForPasteRegion] = useState<{
    trackId: string;
    regionSetId: string;
  } | null>(null);


 
  // handlers
  const findRegionSet = (trackId: string, regionSetId: string): TrackRegionSetViewModel | null => {
    const track = trackMap.get(trackId);
    if (!track) return null;
    return track.regionSets.find(set => set.id === regionSetId) ?? null;
  };
  //create
  const onCreateRegionClick = (trackId: string,regionSetId:string) => {
    const regionSet=findRegionSet(trackId,regionSetId);
    if(!regionSet){
      return;
    }
    setRegionSetForCreateRegion({regionSetId:regionSet?.id,trackId:regionSet?.track_id});
  };

  const onSubmitCreateRegionModal = async (params: CreateRegionParams) => {
    await createRegionMutation.mutateAsync(params);
  };

  const onCloseCreateRegionSetModal = () => {
    setRightClickContext(null);
    setRegionSetForCreateRegion(null);
  };


  //details
  const onDetailsRegionSetClick = (regionSetId: string, trackId: string) => {
    const regionSet = findRegionSet(trackId, regionSetId);
    if (!regionSet) return;
    setDetailedRegionSet(regionSet);
  };

  const onCloseDetailsRegionSetModal=()=>{
    setDetailedRegionSet(null);
    setRightClickContext(null);
  }
///


 //rename
  const onRemoveRegionSetClick = async (regionSetId: string) => {
    await deleteRegionSet.mutateAsync({ region_set_id: regionSetId });
  };
  const onRenameRegionSetClick=(regionSetId:string,trackId:string)=>{
    const targetRegionSet=findRegionSet(trackId,regionSetId);
    if(!targetRegionSet){
      console.log("could not find region set");
      return;
    }
     setRegionSetToRename(targetRegionSet);
  }
  // (you can add rename handlers here later)
  const onSubmitRegionSetRenameModal=async(trackId:string,regionSetId:string,newRegionSetName:string)=>{
    if(!regionSetToRename){
      return;
    }
    
    await renameRegionSet.mutateAsync({ setId: regionSetId, newName: newRegionSetName });
    onCloseRenameRegionSetModal();
  };

  const onCloseRenameRegionSetModal=()=>{
    setRightClickContext(null);
    setRegionSetToRename(null);
  }


  const onCopyRegionSetClick = (regionSetId: string, trackId: string) => {
    const regionSet = findRegionSet(trackId, regionSetId);
    if (!regionSet) return;

    setClipboard({ type: "regionSet", trackId, regionSetId }); // 🔑 store in global clipboard
    console.log("Copied region set:", regionSet.name);
  };


  const onPasteRegionClick=(destTrackId:string,destRegionSetId:string)=>{
    if (clipboard?.type !== "region" || !clipboard){
      console.error("Nothing to paste");
      return;
    }

    const sourceRegionSet = findRegionSet(clipboard.trackId, clipboard.regionSetId);
    if (!sourceRegionSet){
       console.error("Clipboard region set not found anymore");
       return;
    }
    const sourceRegion=sourceRegionSet.regions.find(x=>x.region_id===clipboard.regionId);
    if(!sourceRegion){
       console.error("Clipboard region  not found anymore");
       return;
    }
    const destRegionSet=findRegionSet(destTrackId,destRegionSetId);
    if(!destRegionSet){
       console.error("Destination region set  not found");
       return;
    }
    setRegionSetForPasteRegion({ trackId: destTrackId, regionSetId: destRegionSetId });
  }

  const onPasteRegionSubmit=async(regionSetId:string,regionId:string,copyRegionName:string)=>{
    await copyRegionMutation.mutateAsync({regionId:regionId,regionSetId:regionSetId,copyName:copyRegionName}); 
    onClosePasteRegionSetModal();
  };
  const onClosePasteRegionSetModal=()=>{
      setRegionSetForPasteRegion(null); // ✅ Clear parent = close modal
      setRightClickContext(null);
  };

  const pasteSourceRegion = clipboard?.type === "region" 
    ? findRegionSet(clipboard.trackId, clipboard.regionSetId)
        ?.regions.find(r => r.region_id === clipboard.regionId)
    : null;
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
          onCreateRegion={onCreateRegionClick}
          onDetails={onDetailsRegionSetClick}
          onCopy={onCopyRegionSetClick}
          onPasteRegion={onPasteRegionClick}
          canPasteRegion={clipboard?.type==="region"}
          onRemove={onRemoveRegionSetClick}
          onRename={onRenameRegionSetClick}
        />
      )}

      {/* Modals */}
      {rightClickContext?.type === "regionSet" && regionSetForCreateRegion && (
        <CreateRegionModal
          trackId={regionSetForCreateRegion?.trackId}
          regionSetId={regionSetForCreateRegion?.regionSetId}
          startTime={null}
          endTime={null}
          open={Boolean(regionSetForCreateRegion)}
          onClose={onCloseCreateRegionSetModal}
          onSubmit={async(e)=>await onSubmitCreateRegionModal(e)}
        />
      )}
       { detailedRegionSet && (rightClickContext?.type === "regionSet") &&
        <DetailsRegionSetModal
          regionSet={detailedRegionSet}
          open={Boolean(detailedRegionSet)}
          onClose={onCloseDetailsRegionSetModal}
        />
      }

        {regionSetToRename &&  (rightClickContext?.type === "regionSet") &&
        <RegionSetRenameModal 
                regionSetToRename={regionSetToRename}
                onClose={()=>onCloseRenameRegionSetModal()}
                open={Boolean(regionSetToRename)}
                onSubmit={onSubmitRegionSetRenameModal}
              >
        </RegionSetRenameModal>}
      
       {clipboard?.type === "region" && 
       pasteSourceRegion && 
       regionSetForPasteRegion && (
       <PasteRegionModal 
         destRegionSetId={regionSetForPasteRegion.regionSetId}
          regionToCopy={pasteSourceRegion ?? null}
         open={Boolean(regionSetForPasteRegion)}
         onSubmit={onPasteRegionSubmit}
         onClose={onClosePasteRegionSetModal}
       />
      )}
    </>
  );
}
