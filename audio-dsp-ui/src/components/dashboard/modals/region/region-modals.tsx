import { useUIStore } from "@/Stores/UIStore";
import { DetailsRegionModal } from "./details-region-modal";

export function RegionModals() {
  const modalState = useUIStore(state => state.modalState);
  const closeModal = useUIStore(state => state.closeModal);

  if (!modalState) return null;

  switch (modalState.type) {
    case "detailsRegion":
      return <DetailsRegionModal regionId={modalState.regionId} open onClose={closeModal} />;

    case "renameRegion":
      return <RenameRegionModal regionId={modalState.regionId} open onClose={closeModal} />;

    case "deleteRegion":
      return <DeleteRegionModal regionId={modalState.regionId} open onClose={closeModal} />;

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
          open
          onClose={closeModal}
        />
      );

    default:
      return null;
  }
}