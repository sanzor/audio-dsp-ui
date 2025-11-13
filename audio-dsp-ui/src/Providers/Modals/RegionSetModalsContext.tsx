// RegionModalContext.tsx
import { createContext, useState, type ReactNode } from "react";

type RegionSetModalState = 
  | { type: "details"; regionSetId: string; trackId: string }
  | { type: "rename"; regionSetId: string; trackId: string }
  | { type: "copyRegion"; regionSetId: string; regionId: string }
  | null;

type RegionSetModalContextValue = {
  modalState: RegionSetModalState;
  openDetailsModal: ( regionSetId: string, trackId: string) => void;
  openRenameModal: ( regionSetId: string, trackId: string) => void;
  openCopyRegionModal: (regionSetId: string, regionId: string) => void;
  closeModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const RegionSetModalContext = createContext<RegionSetModalContextValue | undefined>(undefined);

export function RegionSetModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<RegionSetModalState>(null);

  const openDetailsModal = (regionSetId: string, trackId: string) => {
    setModalState({ type: "details",  regionSetId, trackId });
  };

  const openRenameModal = (regionSetId: string, trackId: string) => {
    setModalState({ type: "rename", regionSetId, trackId });
  };

  const openCopyRegionModal = (regionSetId: string, regionId: string) => {
    setModalState({ type: "copyRegion", regionSetId, regionId });
  };

  const closeModal = () => setModalState(null);

  return (
    <RegionSetModalContext.Provider
      value={{
        modalState,
        openDetailsModal,
        openRenameModal,
        openCopyRegionModal,
        closeModal,
      }}
    >
      {children}
    </RegionSetModalContext.Provider>
  );
}
