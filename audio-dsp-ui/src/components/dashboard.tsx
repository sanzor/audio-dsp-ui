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




export function Dashboard() {
  const { user, loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const {tracks,addTrack,removeTrack}=useTracks();
  const navigate = useNavigate(); // ✅ must be called here

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]); // ✅ include navigate in dependencies

  if (loading) return <div>Loading...</div>;

  const onRemoveTrack = async (trackId: number): Promise<RemoveTrackResult> => {
    return await removeTrack({ trackId: trackId.toString() });
  };

  // 🧩 Add track
  const onSubmit = async (data: AddTrackParams): Promise<AddTrackResult> => {
    console.log("Submit inside dashboard");
    const result = await addTrack(data);
    setModalOpen(false); // ✅ Close after submission
    return result;
  };
  
  const onClose = () => {
    setModalOpen(false); // ✅ Close modal
  };
 return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar
          onAddTrackClick={() => setModalOpen(true)}
          onRemoveTrack={onRemoveTrack}
           tracks={(Array.isArray(tracks) ? tracks : []).map(track => ({
          ...track,
          regions: [],
           }))}
        />
        <TrackCreateModal 
          open={modalOpen} 
          onClose={onClose} 
          onSubmit={onSubmit} 
        />

        <main className="flex-1">Main content here</main>
      </div>
    </SidebarProvider>
  );
}