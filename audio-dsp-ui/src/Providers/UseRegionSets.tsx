import { useContext } from "react";

import { RegionSetsContext} from './RegionSetsContext'

export const useRegionSets = () => {
  const ctx = useContext(RegionSetsContext);
  if (!ctx) {
    throw new Error("useSelectedTrack must be used within SelectedTrackProvider");
  }
  return ctx;
};