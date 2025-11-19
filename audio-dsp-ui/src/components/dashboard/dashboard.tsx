import { useAuth } from "@/Auth/UseAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams";
import type { AddTrackResult } from "@/Dtos/Tracks/AddTrackResult";
import { AppSidebar } from "./sidebar/app-sidebar";
import { SidebarProvider } from "../ui/sidebar-provider";

import { useTracks } from "@/Providers/UseTracks";

import type { OpenedContext, SelectedContext } from "@/Providers/UIStore/UIStateProvider";
import { useUIState } from "@/Providers/UIStore/UseUIStateProvider";
import { TrackController } from "../controllers/track-controller";
import { CreateTrackModal } from "./modals/track/create-track-modal";
import { RegionSetController } from "../controllers/RegionSetController";
import { RegionController } from "../controllers/region-controller";
import { DashboardLayout } from "./dashboard-layout";
import { TransformStorePanel } from "./store/transform-store-panel";
import { CanvasPanel } from "./graph/canvas-panel";
import { SidebarInset } from "../ui/sidebar";
import { useTrackViewModels } from "@/Selectors/trackViewModels";
import { WaveformPlayer } from "./waveform/WaveformPlayer";



export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { addTrack } = useTracks();
  const {
    setSelectedContext,
    openedContext,
    setOpenedContext
  } = useUIState();


  // const openedRegionId =
  //   openedContext && openedContext.type === "region"
  //     ? openedContext.regionId
  //     : null;

  const {rightClickContext, setRightClickContext} = useUIState();
  const [addTrackModalOpen, setAddTrackModalOpen] = useState(false);


  const sidebarTracks = useTrackViewModels();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, navigate, user]);

  const handleSelect = (ctx: SelectedContext) => {
    setSelectedContext(ctx);
  };
  const handleOpen=(ctx:OpenedContext)=>{
    setOpenedContext(ctx);
  }

  const onSubmitAddTrackModal = async (data: AddTrackParams): Promise<AddTrackResult> => {
    const result = await addTrack(data);
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
      <TrackController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
      <RegionSetController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
      <RegionController rightClickContext={rightClickContext} setRightClickContext={setRightClickContext} />
    </SidebarProvider>
  );
}


