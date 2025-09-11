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
import { DetailsTrackModal } from "./details-track-modal";
import { CopyTrackModal } from "./copy-track-modal";
import type { CopyTrackParams } from "@/Dtos/Tracks/CopyTrackParams";
import { apiCopyTrack, apiGetTrackRaw } from "@/Services/TracksService";
import { WaveformPlayer } from "./waveform-player";
import { useAudioPlaybackCache } from "@/Providers/UsePlaybackCache";



export function Dashboard() {
  const { user, loading } = useAuth();
  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);
  const [renameTrackModalOpen,setRenameTrackModalOpen]=useState(false);
  const [trackToRename,setTrackToRename]=useState<{trackId:string,trackInitialName:string}|null>(null);
  const [detailsTrackModalOpen,setDetailsTrackModalOpen]=useState(false);
  const [detailedTrack,setDetailedTrack]=useState<TrackMetaWithRegions|null>(null);
  const [copiedTrack,setCopiedTrack]=useState<TrackMetaWithRegions|null>(null);
  const [copyTrackModalOpen,setCopyTrackModalOpen]=useState(false);

  const [selectedTrack,setSelectedTrack]=useState<TrackMetaWithRegions|null>(null);
  const { setBlob, getBlob } = useAudioPlaybackCache();


  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const [waveformPlayerOpen,setWaveformPlayerOpen]=useState(false);
  const {tracks,addTrack,removeTrack,updateTrack}=useTracks();

 const [tracksWithRegions, setTracksWithRegions] = useState<TrackMetaWithRegions[]>([]);

  useEffect(() => {
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
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setWaveformPlayerOpen(true);
  };

  
  const onRemoveTrack = async (trackId: string): Promise<RemoveTrackResult> => {
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
 return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar
          onSelect={onSelectTrack}
          onAddTrackClick={() => setAddTrackModalOpen(true)}
          onRemoveTrack={onRemoveTrack}
          onCopyTrack={onCopyTrackClick}
          onPasteTrack={onPasteTrackClick}
          onDetailTrack={onDetailsTrackClick}
          onRenameTrack={onRenameTrackClick}
           tracks={tracksWithRegions}
        />
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
          {waveformPlayerOpen && selectedTrack && objectUrl && (
            <WaveformPlayer track={selectedTrack} url={objectUrl} />
          )}
        <main className="flex-1">Main content here</main>
      </div>
    </SidebarProvider>
  );
}