
// RegionSetController.tsx
import {  useState } from "react";

import { RegionContextMenu } from "../region-context-menu";
import { CreateRegionModal } from "../modals/create-region-modal";
import type { CreateRegionParams } from "@/Dtos/RegionSets/CreateRegionParams";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets, useRegionsSets } from "@/Providers/UseRegionSets";
import {  apiCreateRegionSet } from "@/Services/RegionSetsService";
import { error } from "console";
import type { RightClickContext } from "../dashboard";
import { DetailsRegionModal } from "../modals/details-region-modal";
import { RegionRenameModal } from "../modals/rename-region-modal";
import { useClipboard } from "@/Providers/UseClipboard";
import type { TrackRegion } from "@/Domain/TrackRegion";
import { useTracks } from "@/Providers/UseTracks";

type RegionControllerProps = {
  rightClickContext: RightClickContext;
  setRightClickContext: (ctx: RightClickContext) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function RegionController({
  rightClickContext,
  setRightClickContext,
}: RegionControllerProps) {
  const { clipboard, setClipboard } = useClipboard();
  const { tracks } = useTracks();



  const { removeRegion,trackRegionSetsMap,updateRegion ,copyRegion} = useRegionSets();


  const [createRegionModalOpen, setCreateRegionModalOpen] = useState(false);

  const [detailsRegionModalOpen, setDetailsRegionModalOpen] = useState(false);
  const [detailedRegionSet, setDetailedRegionSet] = useState<TrackRegion | null>(null);


const [renameRegionModalOpen,setRenameRegionModalOpen]=useState(false);
const [regionToRename,setRegionToRename]=useState<TrackRegion|null>(null);


 
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
    const region=regionSet.regions.find((x)=>x.region_id===regionId);
    if (!region) {
      error(`Could not find region  ${regionId}`);
      return null;
    }
    return region;
  }
  //create
  const onCreateRegionClick = (trackId: string) => {
    const track = tracks.find((x) => x.track_id === trackId);
    if (!track) {
      error("Could not find track");
      return;
    }
    setCreateRegionModalOpen(true);
  };

  const onSubmitCreateRegionSetModal = async (params: CreateRegionSetParams) => {
    await apiCreateRegionSet({ name: params.name, track_id: params.track_id });
    setCreateRegionModalOpen(false);
    setRightClickContext(null);
  };

  const onCloseCreateRegionSetModal = () => {
    setCreateRegionModalOpen(false);
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
    setDetailsRegionModalOpen(true);
  };

  const onCloseDetailsRegionSetModal=()=>{
    setDetailedRegionSet(null);
    setDetailsRegionModalOpen(false);
  }
///


 //rename
  const onRemoveRegionSetClick = async (regionSetId: string) => {
    await removeRegionSet({ region_set_id: regionSetId });
  };
  const onRenameRegionSetClick=(regionSetId:string,trackId:string)=>{
    const targetRegionSet=findRegion(trackId,regionSetId);
    if(targetRegionSet){
      console.log("could not find region set");
      return;
    }
     setRegionToRename(targetRegionSet);
     setRenameRegionModalOpen(true);
  }
  // (you can add rename handlers here later)
  const onSubmitRegionSetRenameModal=async(trackId:string,regionSetId:string,newRegionSetName:string)=>{
    if(!regionToRename){
      return;
    }
    
    const result=await updateRegionSet({name:newRegionSetName,region_set_id:regionSetId,trackId:trackId});
    setRenameRegionModalOpen(false);
    return result;
  };

  const onCloseRenameRegionSetModal=()=>{
    setRenameRegionModalOpen(false);
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
    setPasteRegionDestination({ trackId: destTrackId, regionSetId: destRegionSetId });
  }

  const onPasteRegionSubmit=async(regionSetId:string,regionId:string,copyRegionName:string)=>{
    const result=await copyRegion({regionId:regionId,regionSetId:regionSetId,copyName:copyRegionName});
    setPasteRegionDestination(null);
    return result;
  };
  const onClosePasteRegionSetModal=()=>{
      setPasteRegionDestination(null);
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
          onCreateRegion={onCreateRegionSetClick}
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
        <CreateRegionSetModal
          trackId={rightClickContext.trackId}
          open={createRegionModalOpen}
          onClose={onCloseCreateRegionSetModal}
          onSubmit={onSubmitCreateRegionSetModal}
        />
      )}
       { detailedRegionSet && (rightClickContext?.type === "regionSet") &&
        <DetailsRegionSetModal
          regionSet={detailedRegionSet}
          open={detailsRegionModalOpen}
          onClose={onCloseDetailsRegionSetModal}
        />
      }

        {regionToRename &&  (rightClickContext?.type === "regionSet") &&
        <RegionSetRenameModal 
                regionSetToRename={regionToRename}
                onClose={()=>onCloseRenameRegionSetModal()}
                open={renameRegionModalOpen}
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
