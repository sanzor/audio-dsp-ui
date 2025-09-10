import type { TrackMetaWithRegions } from "@/Domain/TrackMetaWithRegions";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { useTracks } from "./UseTracks";


interface SelectedTrackContextType{
    selectedTrack:TrackMetaWithRegions|null;
    setSelectedTrack:(track:TrackMetaWithRegions|null)=>void;
}
interface SelectedTrackProviderProps {
  children: ReactNode
}
// eslint-disable-next-line react-refresh/only-export-components
export const SelectedTrackContext=createContext<SelectedTrackContextType|null>(null);

export const SelectedTrackContextProvider=({children}:SelectedTrackProviderProps)=>{
    const {tracks}=useTracks();
    const [selectedTrack,setSelectedTrack]=useState<TrackMetaWithRegions|null>(null);

    useEffect(()=>{
        if(!selectedTrack){
            setSelectedTrack(null);
        }
        const stillExists=tracks.find(x=>x.track_id===selectedTrack?.track_id);
        if(!stillExists){
            setSelectedTrack(null);
        }

    },[tracks,selectedTrack]);
    return (
    <SelectedTrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </SelectedTrackContext.Provider>
  );

}
