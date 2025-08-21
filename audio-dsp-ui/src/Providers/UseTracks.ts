import { useContext } from 'react';
import {TrackContext as TracksContext} from "./TracksContext";

export const useTracks = () => {
  const context = useContext(TracksContext)
  if (!context) throw new Error('useTracks must be used within a TrackProvider')
  return context
}
