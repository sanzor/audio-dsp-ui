/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@/Auth/UseAuth";
import { useCallback, useEffect, useState } from "react";
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
import { useSelection } from "@/Providers/UseSelection";


export type RightClickContext =
  | { type: "track"; trackId: string; x: number; y: number }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string; x: number; y: number }
  | { type: "regionSet"; trackId: string; regionSetId: string; x: number; y: number }
  | null;



type Clipboard =
  | { type: "track"; trackId: string }
  | { type: "regionSet"; trackId: string; regionSetId: string }
  | { type: "region"; trackId: string; regionSetId: string; regionId: string }
  | null; 
export function Dashboard() {

 
  const [rightClickContext, setRightClickContext] = useState<RightClickContext>(null);
  const [clipboard, setClipboard] = useState<Clipboard>(null);
  const { user, loading } = useAuth();
  const {selectedContext}=useSelection();

  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);
  const [createRegionSetModalOpen, setCreateRegionSetModalOpen] = useState(false);
  const [createRegionSetTrackId,setCreateRegionSetTrackId]=useState<string|null>(null);


  //details


  //copy
  const [copiedTrack,setCopiedTrack]=useState<TrackMetaWithRegions|null>(null);
  const [copiedRegionSet,setCopiedRegionSet]=useState<TrackRegionSet|null>(null);
  const [copyTrackModalOpen,setCopyTrackModalOpen]=useState(false);
  const [copyRegionSetModalOpen,setCopyRegionSetModalOpen]=useState(false);
  const [copiedRegion,setCopiedRegion]=useState<TrackRegion|null>(null);
  const [copyRegionModalOpen,setCopyRegionModalOpe]=useState(false);
  

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
  

  const onSelectTrack = useCallback(async (trackId: string) => {
      const track = tracks.find((x) => x.track_id === trackId);
        if (!track) return;

      setSelectedTrack({ ...track, regions: [] });

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
      console.log("🧪 Blob debug:", { type: blob.type, size: blob.size });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setWaveformPlayerOpen(true);
}, [tracks, getBlob, setBlob]);


 useEffect(() => {
    if (!selectedContext) return;

    let cancelled = false;

    const run = async () => {
      if (selectedContext.type === "track") {
        if (!cancelled) {
          await onSelectTrack(selectedContext.trackId);
        }
      }

      if (selectedContext.type === "regionSet") {
        if (!cancelled) {
          await onSelectRegionSet(
            selectedContext.trackId,
            selectedContext.regionSetId
          );
        }
      }

      if (selectedContext.type === "region") {
        if (!cancelled) {
          console.log("selected region:", selectedContext.regionId);
          await onSelectRegion(
            selectedContext.trackId,
            selectedContext.regionSetId,
            selectedContext.regionId
          );
        }
      }
    };

    run();

    return () => {
      cancelled = true; // avoid state updates if component unmounts
    };
  }, [selectedContext]);
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


  const onSelectRegionSet=async (trackId:string,regionSet:string)=>{

  }

  const onSelectRegion=async (trackId:string,regionSetId:string,regionId:string)=>{

  }
  const onRemoveTrackClick = async (trackId: string): Promise<RemoveTrackResult> => {
    return await removeTrack({ trackId: trackId.toString() });
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

  

  //regions
  const onCreateRegionClick=(trackId:string,regionSetId:string)=>{

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
       
        onRemoveTrack={onRemoveTrackClick}

        onPasteTrack={onPasteTrackClick}

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
       
      </div>
    </SidebarProvider>
  );
}