import { useContext } from "react";
import { RegionModalContext } from "./RegionModalsContext";

export function useRegionModals() {
  const context = useContext(RegionModalContext);
  if (!context) {
    throw new Error("useRegionModals must be used within RegionModalProvider");
  }
  return context;
}