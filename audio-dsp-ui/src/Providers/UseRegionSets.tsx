import { useContext } from "react";

import {Reg} from './RegionSetsContext'

export const useSelectedTrack = () => {
  const ctx = useContext(RegionSetsContext);
  if (!ctx) {
    throw new Error("useSelectedTrack must be used within SelectedTrackProvider");
  }
  return ctx;
};