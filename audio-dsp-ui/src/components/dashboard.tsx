import { useAuth } from "@/Auth/UseAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar-provider";
import { dummyData } from "@/DummyData";
import { AppSidebar } from "./app-sidebar";
import { useTracks } from "@/Providers/UseTracks";


export function Dashboard() {
  const { user, loading } = useAuth();
   const {
    tracks,         // ✅ the actual list of tracks
    removeTrack,    // ✅ action methods
    addTrack,
    refreshTracks,
  } = useTracks();   // ✅ get them from context
  const navigate = useNavigate(); // ✅ must be called here

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]); // ✅ include navigate in dependencies

  if (loading) return <div>Loading...</div>;

  return (
      <SidebarProvider> {/* ✅ Provide context here */}
      <div className="flex">
        <AppSidebar 
          tracks={tracks.map((track)=>({
            ...track,
            regions:[]
          }))}></AppSidebar>
        <main className="flex-1">Main content here</main>
      </div>
    </SidebarProvider>
  );
}