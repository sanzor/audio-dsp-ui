import { useAuth } from "@/Auth/UseAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateTrackParams } from "@/Dtos/Tracks/AddTrackParams";
import type { CreateTrackResult } from "@/Dtos/Tracks/AddTrackResult";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarProvider } from "../ui/sidebar-provider";
import { CreateTrackModal } from "./modals/track/create-track-modal";
import { DashboardLayout } from "./dashboard-layout";
import { TransformStorePanel } from "./store/transform-store-panel";
import { CanvasPanel } from "./graph/canvas-panel";
import { SidebarInset } from "../ui/sidebar";
import { useTrackViewModels } from "@/Selectors/trackViewModels";
import { WaveformPlayer } from "./waveform/WaveformPlayer";
import { RegionSetContextMenuContainer } from "./context-menus/region-set-context-menu-container";
import { TrackContextMenus } from "./context-menus/track-context-menu-container";
import { useUIStore, type OpenedContext, type SelectedContext } from "@/Stores/UIStore";
import { useTrackController } from "@/controllers/TrackController";



export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { handleCreateTrack}=useTrackController();
  const {open,select} = useUIStore();


  // const openedRegionId =
  //   openedContext && openedContext.type === "region"
  //     ? openedContext.regionId
  //     : null;


  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);


  const sidebarTracks = useTrackViewModels();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, navigate, user]);

  const handleSelect = (ctx: SelectedContext) => {
    select(ctx);
  };
  const handleOpen=(ctx:OpenedContext)=>{
    open(ctx);
  }

  const onSubmitAddTrackModal = async (data: CreateTrackParams): Promise<CreateTrackResult> => {
    const result = await handleCreateTrack(data);
    setAddTrackModalOpen(false);
    return result;
  };

  const onCloseAddTrackModal = () => setAddTrackModalOpen(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar - fixed width */}
        <AppSidebar
          tracks={sidebarTracks}
          onAddTrackClick={() => setAddTrackModalOpen(true)}
          onRightClick={setRightClickContext}
          onSelect={handleSelect}
          onOpen={handleOpen}
          user={{
            name: user?.name ?? "Unknown User",
            email: user?.email ?? "",
            avatar: user?.photo ?? "/default-avatar.png",
          }}
          teams={[
            { name: "My Workspace", logo: () => null, plan: "Free" },
          ]}
        />

        {/* Main content - takes remaining space */}
        <SidebarInset className="flex-1 overflow-hidden">
          <DashboardLayout
            store={<TransformStorePanel />}
            canvas={<CanvasPanel />}
            waveform={
                (openedContext &&
                <WaveformPlayer 
                onCopyRegion={(id)=>}
                onEditRegion={}
                onCreateRegionClick={}
                onCreateRegionDrag={}
                openedContext={openedContext}>
                </WaveformPlayer>)
            }
          />
        </SidebarInset>
      </div>

      <CreateTrackModal open={addTrackModalOpen} onClose={onCloseAddTrackModal} onSubmit={onSubmitAddTrackModal} />
      <RegionSetContextMenuContainer></RegionSetContextMenuContainer>
      <TrackContextMenus></TrackContextMenus>
    </SidebarProvider>
  );
}


