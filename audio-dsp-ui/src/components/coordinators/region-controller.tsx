
// RegionSetController.tsx
import {  useState } from "react";

import { RegionSetContextMenu } from "../region-set-context-menu";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets } from "@/Providers/UseRegionSets";
import { error } from "console";
import type { RightClickContext } from "../dashboard";
import { DetailsRegionSetModal } from "../modals/details-region-set-modal";
import { useTracks } from "@/Providers/UseTracks";
import { RegionSetRenameModal } from "../modals/rename-region-set-modal";
import { PasteRegionModal } from "../modals/paste-region-modal";
import type { CreateRegionParams } from "@/Dtos/Regions/CreateRegionParams";
import { CreateRegionModal } from "../modals/create-region-modal";
import { useUIState } from "@/Providers/UseUIStateProvider";
import type { TrackRegion } from "@/Domain/TrackRegion";
import type { CreateGraphParams } from "@/Dtos/Graphs/CreateGraphParams";

type RegionControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function RegionController({
  rightClickContext,
  setRightClickContext,
}: RegionControllerProps) {
  const { clipboard, setClipboard } = useUIState();

  const { 
    removeRegionSet,
    trackRegionSetsMap,updateRegionSet ,copyRegion,createRegion} = useRegionSets();
  const { tracks } = useTracks();

  const [regionForCreateGraph,setRegionForCreateGraph]=useState<{trackId:string,regionSetId:string,regionId:string}|null>(null);
  const [detailedRegion, setDetailedRegion] = useState<TrackRegion | null>(null);
  const [regionToRename,setRegionToRename]=useState<TrackRegionSet|null>(null);
  const [regionForPasteGraph, setRegionForPasteGraph] = useState<{
    trackId: string;
    regionSetId: string;
    regionId:string
  } | null>(null);


 
  // handlers
  const findRegion=(trackId:string,regionSetId:string,regionId:string):TrackRegion|null=>{
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
    const region = regionSet.regions.find((x) => x.region_id === regionId);
    if (!region) {
      error(`Could not find region  ${region}`);
      return null;
    }
    return region;
  }
  //create
  const onCreateGraphClick = (trackId: string,regionSetId:string,regionId:string) => {
    const region=findRegion(trackId,regionSetId,regionId);
    if(!region){
      return;
    }
    setRegionForCreateGraph({regionSetId:region?.region_set_id,trackId:trackId,regionId:regionId});
  };

  const onSubmitCreateGraphModal = async (params: CreateGraphParams) => {
    await createRegion({ 
      name: params.name, 
      trackId:params.trackId,
      region_set_id:params.region_set_id,
      start_time:params.start_time,
      end_time:params.end_time });
  };

  const onCloseCreateRegionSetModal = () => {
    setRightClickContext(null);
    setRegionForCreateGraph(null);
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
    setDetailedRegion(regionSet);
  };

  const onCloseDetailsRegionSetModal=()=>{
    setDetailedRegion(null);
    setRightClickContext(null);
  }
///


 //rename
  const onRemoveRegionSetClick = async (regionSetId: string) => {
    await removeRegionSet({ region_set_id: regionSetId });
  };
  const onRenameRegionSetClick=(regionSetId:string,trackId:string)=>{
    const targetRegionSet=findRegion(trackId,regionSetId);
    if(!targetRegionSet){
      console.log("could not find region set");
      return;
    }
     setRegionToRename(targetRegionSet);
  }
  // (you can add rename handlers here later)
  const onSubmitRegionSetRenameModal=async(trackId:string,regionSetId:string,newRegionSetName:string)=>{
    if(!regionToRename){
      return;
    }
    
    const result=await updateRegionSet({name:newRegionSetName,region_set_id:regionSetId,trackId:trackId});
    onCloseRenameRegionSetModal();

    return result;
  };

  const onCloseRenameRegionSetModal=()=>{
    setRightClickContext(null);
    setRegionToRename(null);
  }


  const onCopyRegionSetClick = (regionSetId: string, trackId: string) => {
    const regionSet = findRegion(trackId, regionSetId);
    if (!regionSet) return;

    setClipboard({ type: "regionSet", trackId, regionSetId }); // 🔑 store in global clipboard
    console.log("Copied region set:", regionSet.name);
  };


  const onPasteRegionClick=(destTrackId:string,destRegionSetId:string)=>{
    if (clipboard?.type !== "region" || !clipboard){
      console.error("Nothing to paste");
      return;
    }

    const sourceRegionSet = findRegion(clipboard.trackId, clipboard.regionSetId);
    if (!sourceRegionSet){
       console.error("Clipboard region set not found anymore");
       return;
    }
    const sourceRegion=sourceRegionSet.regions.find(x=>x.region_id===clipboard.regionId);
    if(!sourceRegion){
       console.error("Clipboard region  not found anymore");
       return;
    }
    const destRegionSet=findRegion(destTrackId,destRegionSetId);
    if(!destRegionSet){
       console.error("Destination region set  not found");
       return;
    }
    setRegionForPasteGraph({ trackId: destTrackId, regionSetId: destRegionSetId });
  }

  const onPasteRegionSubmit=async(regionSetId:string,regionId:string,copyRegionName:string)=>{
    const result=await copyRegion({regionId:regionId,regionSetId:regionSetId,copyName:copyRegionName}); 
    onClosePasteRegionSetModal();
    return result;
  };
  const onClosePasteRegionSetModal=()=>{
      setRegionForPasteGraph(null); // ✅ Clear parent = close modal
      setRightClickContext(null);
  };

  const pasteSourceRegion = clipboard?.type === "region" 
    ? findRegion(clipboard.trackId, clipboard.regionSetId)
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
          onCreateRegion={onCreateGraphClick}
          onDetails={onDetailsRegionSetClick}
          onCopy={onCopyRegionSetClick}
          onPaste={onPasteRegionClick}
          canPaste={clipboard?.type==="region"}
          onRemove={onRemoveRegionSetClick}
          onRename={onRenameRegionSetClick}
        />
      )}

      {/* Modals */}
      {rightClickContext?.type === "regionSet" && regionForCreateGraph && (
        <CreateRegionModal
          trackId={regionForCreateGraph?.trackId}
          regionSetId={regionForCreateGraph?.regionSetId}
          startTime={null}
          endTime={null}
          open={Boolean(regionForCreateGraph)}
          onClose={onCloseCreateRegionSetModal}
          onSubmit={async(e)=>await onSubmitCreateGraphModal(e)}
        />
      )}
       { detailedRegion && (rightClickContext?.type === "regionSet") &&
        <DetailsRegionSetModal
          regionSet={detailedRegion}
          open={Boolean(detailedRegion)}
          onClose={onCloseDetailsRegionSetModal}
        />
      }

        {regionToRename &&  (rightClickContext?.type === "regionSet") &&
        <RegionSetRenameModal 
                regionSetToRename={regionToRename}
                onClose={()=>onCloseRenameRegionSetModal()}
                open={Boolean(regionToRename)}
                onSubmit={onSubmitRegionSetRenameModal}
              >
        </RegionSetRenameModal>}
      
       {clipboard?.type === "region" && 
       pasteSourceRegion && 
       regionForPasteGraph && (
        <PasteRegionModal 
          destRegionSetId={regionForPasteGraph.regionSetId}
          regionToCopy={pasteSourceRegion}
          open={Boolean(regionForPasteGraph)}
          onSubmit={onPasteRegionSubmit}
          onClose={onClosePasteRegionSetModal}
        />
      )}
    </>
  );
}
