/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/Auth/UseAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracks } from "@/Providers/UseTracks";
import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams";
import type { AddTrackResult } from "@/Dtos/Tracks/AddTrackResult";
import type { RemoveTrackResult } from "@/Dtos/Tracks/RemoveTrackResult";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar-provider";
import { TrackCreateModal } from "./create-track-modal";
import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import { TrackRenameModal } from "./rename-track-modal";
import { DetailsTrackModal } from "./coordinators/details-track-modal";
import { CopyTrackModal } from "./modals/copy-track-modal";
import type { CopyTrackParams } from "@/Dtos/Tracks/CopyTrackParams";
import { apiCopyTrack, apiGetTrackRaw } from "@/Services/TracksService";
import { WaveformPlayer } from "./waveform-player";
import { useAudioPlaybackCache } from "@/Providers/UsePlaybackCache";
import { CreateRegionSetModal } from "./modals/create-region-set-modal";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import { TrackContextMenu } from "./track-context-menu";
import { RegionSetContextMenu } from "./region-set-context-menu";

import type { TrackRegion } from "@/Domain/TrackRegion";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import { useRegionSets } from "@/Providers/UseRegionSets";
import { error } from "node:console";
import { apiCreateRegionSet } from "@/Services/RegionSetsService";


export type RightClickContext =
  | { type: "track"; trackId: string; x: number; y: number }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string; x: number; y: number }
  | { type: "regionSet"; trackId: string; regionSetId: string; x: number; y: number }
  | null;


export type SelectedContext =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null; 

export function Dashboard() {

 
  const [rightClickContext, setRightClickContext] = useState<RightClickContext>(null);
  const { user, loading } = useAuth();
  

  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);
  const [createRegionSetModalOpen, setCreateRegionSetModalOpen] = useState(false);
  const [createRegionSetTrackId,setCreateRegionSetTrackId]=useState<string|null>(null);
  const [renameTrackModalOpen,setRenameTrackModalOpen]=useState(false);
  const [trackToRename,setTrackToRename]=useState<{trackId:string,trackInitialName:string}|null>(null);

  //details
  const [detailsTrackModalOpen,setDetailsTrackModalOpen]=useState(false);
  const [detailedTrack,setDetailedTrack]=useState<TrackMetaWithRegions|null>(null);
  const [detailsRegionSetModalOpen,setDetailsRegionSetModalOpen]=useState(false);
  const [detailedRegionSet,setDetailedRegionSet]=useState<TrackRegionSet|null>(null);
  const [detailsRegionModalOpen,setDetailsRegionModalOpen]=useState(false);
  const [detailedRegion,setDetailedRegion]=useState<TrackRegion|null>(null);

  //copy
  const [copiedTrack,setCopiedTrack]=useState<TrackMetaWithRegions|null>(null);
  const [copiedRegionSet,setCopiedRegionSet]=useState<TrackRegionSet|null>(null);
  const [copyTrackModalOpen,setCopyTrackModalOpen]=useState(false);
  const [copyRegionSetModalOpen,setCopyRegionSetModalOpen]=useState(false);
  const [copiedRegion,setCopiedRegion]=useState<TrackRegion|null>(null);
  const [copyRegionModalOpen,setCopyRegionModalOpe]=useState(false);
  

  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);
  const [selectedTrack,setSelectedTrack]=useState<TrackMetaWithRegions|null>(null);
  const { setBlob, getBlob } = useAudioPlaybackCache();


  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [waveformPlayerOpen,setWaveformPlayerOpen]=useState(false);
  const {tracks,addTrack,removeTrack,updateTrack}=useTracks();
  const {
    createRegion,
    createRegionSet,
    removeRegionSet,
    trackRegionSetsMap,
    removeRegion,
    updateRegionSet}=useRegionSets();

 const [tracksWithRegions, setTracksWithRegions] = useState<TrackMetaWithRegions[]>([]);

  useEffect(() => {
    console.log("url object");
      return () => {
      if (objectUrl) {
       URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  useEffect(()=>{
    console.log("🔍 tracks value in effect:", tracks, typeof tracks);
    console.log("🔍 Array.isArray(tracks):", Array.isArray(tracks));
    if(!Array.isArray(tracks)){
      return;
    }
    const result=tracks.map((track)=>(
      {
        ...track,
        regions:[]
      }
    ));
    console.log(result);
    setTracksWithRegions(result);
  },[tracks]);

  const navigate = useNavigate(); // ✅ must be called here
    useEffect(()=>{
      console.log("Tracks inside  dashboard",tracks);
    },[tracks]);


  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]); // ✅ include navigate in dependencies

  if (loading) return <div>Loading...</div>;
  const onSelect=async(ctx:SelectedContext)=>{
    if(ctx?.type=="track"){
      await onSelectTrack(ctx.trackId);
    }
    if(ctx?.type=="regionSet"){
      await onSelectRegionSet(ctx.trackId,ctx.regionSetId);
    }
    if(ctx?.type=="region"){
      console.log("selected region:",ctx.regionId);
      await onSelectRegion(ctx.trackId,ctx.regionSetId,ctx.regionId);
    }
  }
  const onSelectTrack=async(trackId:string)=>{
      const track=tracks.find(x=>x.track_id===trackId);
      if(!track){
        return;
      }
      setSelectedTrack({...track,regions:[]});
      let blob = getBlob(trackId);
      
      if (!blob) {
        try {
          const response = await apiGetTrackRaw({ track_id: trackId });
          blob = response.blob;
          setBlob(trackId, blob);
        } catch (e) {
            console.error("Failed to fetch audio blob", e);
            return;
        }
      }
      console.log("🧪 Blob debug:", {type: blob.type,size: blob.size });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setWaveformPlayerOpen(true);
  };

  const onSelectRegionSet=async (trackId:string,regionSet:string)=>{
      setsele
  }

  const onSelectRegion=async (trackId:string,regionSetId:string,regionId:string)=>{

  }
  const onRemoveTrackClick = async (trackId: string): Promise<RemoveTrackResult> => {
    return await removeTrack({ trackId: trackId.toString() });
  };

  const onDetailsTrackClick=(trackId:string)=>{
    const track=tracks.find(x=>x.track_id===trackId);
    if(!track){
      return;
    }
    setDetailedTrack({...track,regions:[]});
    setDetailsTrackModalOpen(true);
  };
  const onCloseDetailsTrack=()=>{
    setDetailsTrackModalOpen(false);
  }
  const onCopyTrackClick=(trackId:string)=>{
     const track=tracks.find(x=>x.track_id==trackId);
     if(!track){
      return;
     }
     console.log("Copied track");
     setCopiedTrack({...track,regions:[]});
     //notify user copy took place

  };
 // Optional dep
  const onPasteTrackClick=()=>{
    console.log("inside paste");
    if(!copiedTrack){
      return undefined;
    }
    setCopyTrackModalOpen(true);
  };


  const onSubmitCopyTrackModal=async(trackId:string,copyTrackName:string)=>{
    const params:CopyTrackParams={copy_track_name:copyTrackName,track_id:trackId};
    const result=await apiCopyTrack(params)
    setCopyTrackModalOpen(false);
    return result;
  };
  const onCloseCopyTrackModal=()=>{
    setCopyTrackModalOpen(false);
  };
  const onRenameTrackClick=(trackId:string)=>{
     const targetTrack=tracks.find(x=>x.track_id===trackId);
     if(!targetTrack){
        return;
     }
     console.log("click rename");
     setTrackToRename({trackId:trackId,trackInitialName:targetTrack.track_info.name});
     setRenameTrackModalOpen(true);
  };
  const onSubmitRenameTrackModal=async(trackId:string,newTrackName:string)=>{
    if(!trackToRename){
      return;
    }
    
    const result=await updateTrack({track_id:trackId,track_name:newTrackName});
    setRenameTrackModalOpen(false);
    return result;
  };

  const onCloseRenameTrackModal=()=>{
    setRenameTrackModalOpen(false);
  }
  // 🧩 Add track
  const onSubmitAddTrackModal = async (data: AddTrackParams): Promise<AddTrackResult> => {
    console.log("Submit inside dashboard");
    const result = await addTrack(data);
    setAddTrackModalOpen(false); // ✅ Close after submission
    return result;
  };
  
  const onCloseAddTrackModal = () => {
    setAddTrackModalOpen(false); // ✅ Close modal
  };

  
  //region sets
  const onCreateRegionSetClick=(trackId:string)=>{
    const track=tracksWithRegions.find(x=>x.track_id===trackId);
    if(!track){
      error("Could not find track");
    }
    setCreateRegionSetTrackId(trackId);
    setCreateRegionSetModalOpen(true);
  }

  const onSubmitCreateRegionSetModal=async(createRegionSetParams:CreateRegionSetParams)=>{
    
    const result=await apiCreateRegionSet({name:createRegionSetParams.name,track_id:createRegionSetParams.track_id});
    setRenameTrackModalOpen(false);
    setRightClickContext(null);
    setCreateRegionSetTrackId(null);
    return result;
  };

  const onCloseCreateRegionSetModal=()=>{
    setCreateRegionSetModalOpen(false);
    setRightClickContext(null);
  }

  const onDetailsRegionSetClick=(regionSetId:string,trackId:string)=>{
    const track=tracks.find(x=>x.track_id===trackId);
    if(!track){
      error(`Could not find track ${trackId}`)
      return;
    }
    const regionSets=trackRegionSetsMap.get(track.track_id);
    if(!regionSets){
      error("Could not find region sets");
      return;
    }
    const regionSet=regionSets.find(x=>x.region_set_id===regionSetId);
    if(!regionSet){
      error(`Could not find region set ${regionSetId}`)
      return;
    }
    setDetailedRegionSet(regionSet);
    setDetailsTrackModalOpen(true);
  }

 // Optional dep
  const onCopyRegionSetClick=(regionSetId:string,trackId:string)=>{
    const track=tracks.find(x=>x.track_id===trackId);
     if(!track){
      error(`Could not find track ${trackId}`)
      return;
    }
     const regionSets=trackRegionSetsMap.get(track.track_id);
     if(!regionSets){
        error("Could not find region sets");
        return;
     }
     const regionSet=regionSets.find(x=>x.region_set_id===regionSetId);
     if(!regionSet){
        error(`Could not find region set ${regionSetId}`)
        return;
     }
     setCopiedRegionSet(copiedRegionSet);
     setCopyRegionSetModalOpen(true);
     //notify user copy took place

  }
  const onRenameRegionSetClick=(regionSetId:string,trackId:string)=>{
      const targetTrack=tracks.find(x=>x.track_id===trackId);
     if(!targetTrack){
        return;
     }
     console.log("click rename");
     setTrackToRename({trackId:trackId,trackInitialName:targetTrack.track_info.name});
     setRenameTrackModalOpen(true);
  }
  const onRemoveRegionSetClick=async(regionSetId:string,trackId:string)=>{
     await removeRegionSet({region_set_id:regionSetId})
  }
  const onPasteRegionSetClick=()=>{
     console.log("inside paste");
    if(!copiedRegionSet){
      return undefined;
    }
    setCopyRegionSetModalOpen(true);
  }
  //regions
  const onCreateRegionClick=(trackId:string,regionSetId:string)=>{
      setcreate
  }
 

  //waveform methods
  const onWaveCreateRegionClick=async (time:number)=>{

  };

  const onWaveCreateRegionDrag=async (start:number,end:number)=>{

  };
  const onRegionDetails=(regionId:string)=>{
    return null;
  };

  const onWaveEditRegion=async (regionId:string)=>{

  };
  const onWaveDeleteRegion=async(regionId:string)=>{

  }

 return (
    <SidebarProvider>
      <div className="flex">
      <AppSidebar
        onSelect={onSelect}
        onAddTrackClick={() => setAddTrackModalOpen(true)}
        onCreateRegionSet={onCreateRegionSetClick}
        onRemoveTrack={onRemoveTrackClick}
        onCopyTrack={onCopyTrackClick}
        onPasteTrack={onPasteTrackClick}
        onDetailTrack={onDetailsTrackClick}
        onRenameTrack={onRenameTrackClick}
        tracks={tracksWithRegions}

        onRightClick={setRightClickContext}
      />

       {/* Sidebar (Track Management) */}


    {/* Transform Store */}
    <div className="grid grid-cols-[1fr_3fr] grid-rows-[1fr_auto] w-full h-screen">
    {/* Transform Store (left column, top row) */}
      <div className="row-start-1 col-start-1 border-r bg-gray-50 p-4">
        <div className="font-semibold text-sm text-gray-700">Transform Store</div>
         {/* content */}
      </div>

      {/* Canvas (right column, top row) */}
      <div className="row-start-1 col-start-2 p-4 overflow-auto bg-white">
        <main>Main content here</main>
      </div>

      {/* Waveform (bottom row, spans both columns) */}
      <div className="row-start-2 col-span-2 border-t p-4 bg-white shadow-inner">
      {selectedTrack && objectUrl && (
        <WaveformPlayer
         track={selectedTrack} 
         url={objectUrl} 
         onCreateRegionClick={onWaveCreateRegionClick}
         onCreateRegionDrag={onWaveCreateRegionDrag}
         onRegionDetails={onRegionDetails}
         onEditRegion={onWaveEditRegion}
         onDeleteRegion={onWaveDeleteRegion}/>
      )}
      </div>
      </div>

        <TrackCreateModal 
          open={addTrackModalOpen} 
          onClose={onCloseAddTrackModal} 
          onSubmit={onSubmitAddTrackModal} 
        />
        {trackToRename && <TrackRenameModal 
          trackToRename={trackToRename}
          onClose={()=>onCloseRenameTrackModal()}
          open={renameTrackModalOpen}
          onSubmit={onSubmitRenameTrackModal}
        >
        </TrackRenameModal>}

        { rightClickContext?.type=="track" && <CreateRegionSetModal
           trackId={rightClickContext?.trackId}
           open={createRegionSetModalOpen}
           onClose={onCloseCreateRegionSetModal}
           onSubmit={onSubmitCreateRegionSetModal}>
        </CreateRegionSetModal>}

        {detailedTrack &&<DetailsTrackModal
            open={detailsTrackModalOpen}
            track={{...detailedTrack,regions:[]}}
            onClose={onCloseDetailsTrack}>
          </DetailsTrackModal>}
        {copiedTrack && <CopyTrackModal 
              trackToCopy={{
                trackId: copiedTrack.track_id,
                sourceTrackNname: copiedTrack.track_info.name
              }}
              open={copyTrackModalOpen}
              onSubmit={onSubmitCopyTrackModal}
              onClose={onCloseCopyTrackModal}>
        </CopyTrackModal>}


        {rightClickContext?.type=="track" &&(
          <TrackContextMenu
          onClose={()=>setRightClickContext(null)}
          x={rightClickContext.x}
          y={rightClickContext.y}
          trackId={rightClickContext.trackId}
          onCreateRegionSet={(id)=>onCreateRegionSetClick(id)}
          onCopy={onCopyTrackClick}
          onDetails={onDetailsTrackClick}
          onRemove={onRemoveTrackClick}
          onRename={onRenameTrackClick}
          >
        </TrackContextMenu>)}
        {rightClickContext?.type=="regionSet" &&(
          <RegionSetContextMenu
            trackId={rightClickContext.trackId}
            regionSetId={rightClickContext.regionSetId}
            onClose={()=>setRightClickContext(null)}
            x={rightClickContext?.x}
            y={rightClickContext.y}
            onCreateRegion={onCreateRegionClick}
            onDetails={onDetailsRegionSetClick}
            onCopy={onCopyRegionSetClick}
            onRemove={onRemoveRegionSetClick}
            onRename={onRenameRegionSetClick}>
          </RegionSetContextMenu>
        )}
      </div>
    </SidebarProvider>
  );
}