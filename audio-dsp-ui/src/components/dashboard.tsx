import { useAuth } from "@/Auth/UseAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTracks } from "@/Providers/UseTracks";
import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams";




export function Dashboard() {
  const { user, loading } = useAuth();

  const [showCreateTrackModal,setShowCreateTrackModal]=useState(false);
  const {tracks}=useTracks();
  const navigate = useNavigate(); // ✅ must be called here

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]); // ✅ include navigate in dependencies

  if (loading) return <div>Loading...</div>;

  const onRemoveTrack=(trackId:number)=>void{

  };
  const onSubmit=async (data:AddTrackParams)=>AddTrackResult{
      await addTrack(data);
  };
  return (
      <SidebarProvider> {/* ✅ Provide context here */}
      <div className="flex">
        <AppSidebar 
          onAddTrackClick={()=>setShowCreateTrackModal(true)}
          onRemoveTrack={onRemoveTrack}
          tracks={tracks.map((track)=>({
            ...track,
            regions:[]
          }))}>
        </AppSidebar>
        {showCreateTrackModal && (<TrackCreateModal onSubmit={onSubmit}></TrackCreateModal>)}
        <main className="flex-1">Main content here</main>
      </div>
    </SidebarProvider>
  );
}