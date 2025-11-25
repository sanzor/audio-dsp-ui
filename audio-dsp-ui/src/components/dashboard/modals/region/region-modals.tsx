import { useUIStore } from "@/Stores/UIStore";
import { DetailsRegionModal } from "./details-region-modal";
import { RenameRegionModal } from "./rename-region-modal";
import { PasteRegionModal } from "./paste-region-modal";
import { useRegionController } from "@/controllers/RegionController";
import { CreateRegionModal } from "./create-region-modal";
import { useRegionSetController } from "@/controllers/RegionSetController";

export function RegionModals() {
  const modalState = useUIStore(state => state.modalState);
  const closeModal = useUIStore(state => state.closeModal);
  const controller=useRegionController();
  const ctrl=useRegionSetController();

  if (!modalState) return null;

  switch (modalState.type) {
    case "detailsRegion":
      return <DetailsRegionModal regionId={modalState.regionId} open onClose={closeModal} />;

    case "renameRegion":
      return <RenameRegionModal regionId={modalState.regionId} open onClose={closeModal} onSubmit={controller.handleSubmitRenameRegion} />;

    case "createRegion":
      return (
        <CreateRegionModal
          regionSetId={modalState.regionSetId}
          startTime={modalState.startTime}
          endTime={modalState.endTime}
          open
          onClose={closeModal}
        />
      );

    case "pasteRegion":
      return (
        <PasteRegionModal
          params={modalState.params}
          onSubmit={ctrl.handleSubmitPasteRegion}
          open
          onClose={closeModal}
        />
      );

    default:
      return null;
  }
}