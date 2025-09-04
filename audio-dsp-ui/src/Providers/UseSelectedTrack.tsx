import { useContext } from "react";


export const useSelectedTrack = () => {
  const ctx = useContext(SelectedTrackContext);
  if (!ctx) {
    throw new Error("useSelectedTrack must be used within SelectedTrackProvider");
  }
  return ctx;
};