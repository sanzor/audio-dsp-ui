// RegionModalContext.tsx
import { createContext, useState, type ReactNode } from "react";

export interface SourceParams{
    trackId:string,
    regionSetId:string,
    regionId:string,
    graphId:string
}
export interface DestinationParams{
    trackId:string,
    regionSetId:string,
    regionId:string,
}
type RegionModalState = 
  | { type: "details"; regionId: string; regionSetId: string; trackId: string }
  | { type: "rename"; regionId: string; regionSetId: string; trackId: string }
  | { type: "copyGraph";sourceParams:SourceParams,destinationParams:DestinationParams }
  | { type:"createGraph"; regionId:string;regionSetId:string;trackId:string}
  | null;

type RegionModalContextValue = {
  modalState: RegionModalState;
  openDetailsModal: (regionId: string, regionSetId: string, trackId: string) => void;
  openRenameModal: (regionId: string, regionSetId: string, trackId: string) => void;
  openCopyGraphModal: (sourceParams:SourceParams,destinationParams:DestinationParams) => void;
  openCreateGraphModal:(regionId:string,regionSetId:string,trackId:string)=>void;
  closeModal: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const RegionModalContext = createContext<RegionModalContextValue | undefined>(undefined);

export function RegionModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<RegionModalState>(null);

  const openDetailsModal = (regionId: string, regionSetId: string, trackId: string) => {
    setModalState({ type: "details", regionId, regionSetId, trackId });
  };

  const openRenameModal = (regionId: string, regionSetId: string, trackId: string) => {
    setModalState({ type: "rename", regionId, regionSetId, trackId });
  };

  const openCopyGraphModal = (sourceParams:SourceParams,destinationParams:DestinationParams) => {
    setModalState({ type: "copyGraph",sourceParams:sourceParams,destinationParams:destinationParams });
  };

  const openCreateGraphModal = (regionId:string,regionSetId:string,trackId:string)=>{
    setModalState({type:"createGraph",regionId,regionSetId,trackId})
  }

  const closeModal = () => setModalState(null);

  return (
    <RegionModalContext.Provider
      value={{
        modalState,
        openDetailsModal,
        openRenameModal,
        openCopyGraphModal,
        openCreateGraphModal,
        closeModal,
      }}
    >
      {children}
    </RegionModalContext.Provider>
  );
}
