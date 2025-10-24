
// RegionSetController.tsx
import {  useState } from "react";

import { RegionSetContextMenu } from "../region-set-context-menu";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets } from "@/Providers/UseRegionSets";
import {  apiCreateRegionSet } from "@/Services/RegionSetsService";
import { error } from "console";
import type { RightClickContext } from "../dashboard";
import { DetailsRegionSetModal } from "../modals/details-region-set-modal";
import { useTracks } from "@/Providers/UseTracks";
import { RegionSetRenameModal } from "../modals/rename-region-set-modal";
import { useClipboard } from "@/Providers/UseClipboard";
import { PasteRegionModal } from "../modals/paste-region-modal";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";
import { CreateRegionModal } from "../modals/create-region-modal";

type RegionSetsControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function RegionSetController({
  rightClickContext,
  setRightClickContext,
}: RegionSetsControllerProps) {
  const { clipboard, setClipboard } = useClipboard();

  const { removeRegionSet,trackRegionSetsMap,updateRegionSet ,copyRegion} = useRegionSets();
  const { tracks } = useTracks();

  const [parentRegionSetForNewRegion,setParentRegionSetForNewRegion]=useState<{trackId:string,regionSetId:string}|null>(null);
  const [detailedRegionSet, setDetailedRegionSet] = useState<TrackRegionSet | null>(null);
  const [regionSetToRename,setRegionSetToRename]=useState<TrackRegionSet|null>(null);
  const [pasteRegionDestination, setPasteRegionDestination] = useState<{
    trackId: string;
    regionSetId: string;
  } | null>(null);


 
  // handlers
  const findRegionSet=(trackId:string,regionSetId:string):TrackRegionSet|null=>{
     const track = tracks.find((x) => x.track_id === trackId);
    if (!track) {
      error(`Could not find track ${trackId}`);
      return null;
    }
    const regionSets = trackRegionSetsMap.get(track.track_id);
    if (!regionSets) {
      error("Could not find region sets");
      return null;
    }
    const regionSet = regionSets.find((x) => x.region_set_id === regionSetId);
    if (!regionSet) {
      error(`Could not find region set ${regionSetId}`);
      return null;
    }
    return regionSet;
  }
  //create
  const onCreateRegionClick = (trackId: string,regionSetId:string) => {
    const regionSet=findRegionSet(trackId,regionSetId);
    if(!regionSet){
      return;
    }
    setParentRegionSetForNewRegion({regionSetId:regionSet?.region_set_id,trackId:regionSet?.track_id});
  };

  const onSubmitCreateRegionModal = async (params: CreateRegionParams) => {
    await apiCreateRegionSet({ 
      name: params.name, 
      trackId:params.trackId,
      region_set_id:params.region_set_id,
      start_time:params.start_time,
      end_time:params.end_time });
  };

  const onCloseCreateRegionSetModal = () => {
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
  };

  const onCloseDetailsRegionSetModal=()=>{
    setDetailedRegionSet(null);
  }
///


 //rename
  const onRemoveRegionSetClick = async (regionSetId: string) => {
    await removeRegionSet({ region_set_id: regionSetId });
  };
  const onRenameRegionSetClick=(regionSetId:string,trackId:string)=>{
    const targetRegionSet=findRegionSet(trackId,regionSetId);
    if(targetRegionSet){
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
    
    const result=await updateRegionSet({name:newRegionSetName,region_set_id:regionSetId,trackId:trackId});
    onCloseRenameRegionSetModal();

    return result;
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
    setPasteRegionDestination({ trackId: destTrackId, regionSetId: destRegionSetId });
  }

  const onPasteRegionSubmit=async(regionSetId:string,regionId:string,copyRegionName:string)=>{
    const result=await copyRegion({regionId:regionId,regionSetId:regionSetId,copyName:copyRegionName}); 
    onClosePasteRegionSetModal();
    return result;
  };
  const onClosePasteRegionSetModal=()=>{
      setParentRegionSetForNewRegion(null); // ✅ Clear parent = close modal
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
          onPaste={onPasteRegionClick}
          canPaste={clipboard?.type==="region"}
          onRemove={onRemoveRegionSetClick}
          onRename={onRenameRegionSetClick}
        />
      )}

      {/* Modals */}
      {rightClickContext?.type === "regionSet" && (
        <CreateRegionModal
          trackId={rightClickContext.trackId}
          open={true}
          onClose={onCloseCreateRegionSetModal}
          onSubmit={onSubmitCreateRegionModal}
        />
      )}
       { detailedRegionSet && (rightClickContext?.type === "regionSet") &&
        <DetailsRegionSetModal
          regionSet={detailedRegionSet}
          open={true}
          onClose={onCloseDetailsRegionSetModal}
        />
      }

        {regionSetToRename &&  (rightClickContext?.type === "regionSet") &&
        <RegionSetRenameModal 
                regionSetToRename={regionSetToRename}
                onClose={()=>onCloseRenameRegionSetModal()}
                open={true}
                onSubmit={onSubmitRegionSetRenameModal}
              >
        </RegionSetRenameModal>}
      
       {clipboard?.type === "region" && 
       pasteSourceRegion && 
       pasteRegionDestination && (
        <PasteRegionModal 
          destRegionSetId={pasteRegionDestination.regionSetId}
          regionToCopy={pasteSourceRegion}
          open={true}
          onSubmit={onPasteRegionSubmit}
          onClose={onClosePasteRegionSetModal}
        />
      )}
      

      {/* TODO: add DetailsRegionSetModal + CopyRegionSetModal here */}
    </>
  );
}
