import { useUIStore } from "@/Stores/UIStore";
import { useRegionSetController } from "@/controllers/RegionSetController";
import { DetailsRegionSetModal } from "./details-region-set-modal";
import { useTrackController } from "@/controllers/TrackController";
import { RegionSetRenameModal } from "./rename-region-set-modal";
import { CreateRegionSetModal } from "./create-region-set-modal";
import { PasteRegionSetModal } from "./paste-region-set-modal";

export function RegionSetModals() {
  const modalState = useUIStore(state => state.modalState);
  const closeModal = useUIStore(state => state.closeModal);
  const trackController=useTrackController();
  const regionSetController=useRegionSetController();

  if (!modalState) return null;

  switch (modalState.type) {
    case "detailsRegionSet":
      return <DetailsRegionSetModal regionSetId={modalState.regionSetId} open onClose={closeModal} />;

    case "renameRegionSet":
      return <RegionSetRenameModal 
        regionSetId={modalState.regionSetId} 
        open 
        onClose={closeModal}
        onSubmit={regionSetController.handleSubmitRenameRegionSet} 
    />;

    case "createRegionSet":
      return (
        <CreateRegionSetModal
          trackId={modalState.trackId}
          onSubmit={trackController.handleSubmitCreateRegionSet}
          open
          onClose={closeModal}
        />
      );

    case "pasteRegionSet":
      return (
        <PasteRegionSetModal
          params={modalState.params}
          onSubmit={(destRegionSetId,sourceRegionId,copyName)=>
            regionSetController.handleSubmitPasteRegion(
              {source:{regionId:sourceRegionId},destination:{regionSetId:destRegionSetId}},copyName)}
          open
          onClose={closeModal}
        />
      );

    default:
      return null;
  }
}