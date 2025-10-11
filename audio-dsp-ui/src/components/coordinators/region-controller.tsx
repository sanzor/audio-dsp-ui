// RegionSetController.tsx
import {  useState } from "react";

import { RegionSetContextMenu } from "../region-set-context-menu";
import { CreateRegionSetModal } from "../modals/create-region-set-modal";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets } from "@/Providers/UseRegionSets";
import { apiCopyRegionSet, apiCreateRegionSet } from "@/Services/RegionSetsService";
import { error } from "console";
import type { RightClickContext } from "../dashboard";
import { DetailsRegionSetModal } from "../modals/details-region-set-modal";
import { useTracks } from "@/Providers/UseTracks";
import { RegionSetRenameModal } from "../modals/rename-region-set-modal";
import { CopyRegionSetModal } from "../modals/copy-region-set-modal";
import { useClipboard } from "@/Providers/UseClipboard";

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
  const [pasteRegionModalOpen, setPasteRegionModalOpen] = useState(false);
  const [pasteSourceRegion,setPasteSourceRegion]=useState<TrackRegionSet|null>(null);
  const [pasteTargetTrackId,setPasteTargetTrackId]=useState<string|null>(null);

  const { removeRegionSet,trackRegionSetsMap,updateRegionSet,copyRegion,copyRegionSet } = useRegionSets();
  const { tracks } = useTracks();

  const [createRegionSetModalOpen, setCreateRegionSetModalOpen] = useState(false);

  const [detailsRegionSetModalOpen, setDetailsRegionSetModalOpen] = useState(false);
  const [detailedRegionSet, setDetailedRegionSet] = useState<TrackRegionSet | null>(null);


const [renameRegionSetModalOpen,setRenameRegionSetModalOpen]=useState(false);
const [regionSetToRename,setRegionSetToRename]=useState<TrackRegionSet|null>(null);


 
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
     setRenameRegionSetModalOpen(true);
  }
  // (you can add rename handlers here later)
  const onSubmitRegionSetRenameModal=async(trackId:string,regionSetId:string,newRegionSetName:string)=>{
    if(!regionSetToRename){
      return;
    }
    
    const result=await updateRegionSet({name:newRegionSetName,region_set_id:regionSetId,trackId:trackId});
    setRenameRegionSetModalOpen(false);
    return result;
  };

  const onCloseRenameRegionSetModal=()=>{
    setRenameRegionSetModalOpen(false);
  }


  const onCopyRegionSetClick = (regionSetId: string, trackId: string) => {
    const regionSet = findRegionSet(trackId, regionSetId);
    if (!regionSet) return;

    setClipboard({ type: "regionSet", trackId, regionSetId }); // 🔑 store in global clipboard
    console.log("Copied region set:", regionSet.name);
  };

  const onPasteRegionSetClick=(targetTrackId:string)=>{
    if (clipboard?.type !== "regionSet" || !clipboard){
      console.error("Nothing to paste");
      return;
    }

    const sourceRegionSet = findRegionSet(clipboard.trackId, clipboard.regionSetId);
    if (!sourceRegionSet){
       console.error("Clipboard region set not found anymore");
       return;
    }
    setPasteSourceRegion(sourceRegionSet);
    setPasteTargetTrackId(targetTrackId);
    setPasteRegionModalOpen(true);
  }

  const onPasteRegionSetSubmit=async(trackId:string,regionSetId:string,copyRegionSetName:string)=>{

    const result=await copyRegionSet({copy_region_set_name:copyRegionSetName,regionSetId:regionSetId,trackId:trackId});
    return result;
  };
  const onClosePasteRegionSetModal=()=>{
      setPasteRegionModalOpen(false);
  };
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
          onPaste={onPasteRegionSetClick}
          canPaste={clipboard?.type==="region"}
          onRemove={onRemoveRegionSetClick}
          onRename={onRenameRegionSetClick}
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

        {regionSetToRename &&  (rightClickContext?.type === "regionSet") &&
        <RegionSetRenameModal 
                regionSetToRename={regionSetToRename}
                onClose={()=>onCloseRenameRegionSetModal()}
                open={renameRegionSetModalOpen}
                onSubmit={onSubmitRegionSetRenameModal}
              >
        </RegionSetRenameModal>}
      
       {clipboard?.type==="regionSet"  && pasteTargetTrackId && pasteSourceRegion &&
       <CopyRegionSetModal 
                    targetTrackId={pasteTargetTrackId}
                    regionSetToCopy={pasteSourceRegion}
                    open={pasteRegionModalOpen}
                    onPaste={onPasteRegionSetSubmit}
                    onClose={onClosePasteRegionSetModal}>
              </CopyRegionSetModal>}
      

      {/* TODO: add DetailsRegionSetModal + CopyRegionSetModal here */}
    </>
  );
}
