import { useContext } from "react";
import { RegionSetModalContext } from "./RegionSetModalsContext";

export function useRegionSetModals() {
  const context = useContext(RegionSetModalContext);
  if (!context) {
    throw new Error("useRegionModals must be used within RegionSetModalProvider");
  }
  return context;
}