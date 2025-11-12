import { useTrackViewModelById } from "@/Selectors/trackViewModels";

import { useWaveformAudio } from "./WaveformAudio";
import type { OpenedContext } from "@/Providers/UIStateProvider";
import { WaveformRenderer } from "./WaveformRenderer";

export interface WaveformPlayerProps{
    onRegionDetails:(regionId:string)=>void,
    onDeleteRegion:(regionId:string)=>void,
    onEditRegion:(regionId:string)=>void,
    onCreateRegionClick:(time:number)=>void,
    onCreateRegionDrag:(start:number,end:number)=>void,
}
export function WaveformPlayer({ openedContext }: { openedContext: NonNullable<OpenedContext> }) {
  const trackId = openedContext?.trackId;
  const regionSetId = openedContext.type !== "track" ? openedContext.regionSetId : null;

  const { objectUrl, isLoading } = useWaveformAudio(trackId);
  const track = useTrackViewModelById(trackId); // ✅ Add this

  if (isLoading || !objectUrl || !track) return null;

  const handleEditRegion=(regionId:string):void=>{

  }
  const handleRegionDetails=(regionId:string):void=>{

  }
  const handleDeleteRegion=(regionId:string):void=>{

  }
  const handleCreateRegionDrag=(start:number,end:number):void=>{
      
  }
  const handleCreateRegionClick=(start:number):void=>{

  }
  return (
    (regionSetId && <WaveformRenderer
      url={objectUrl}
      track={track}              // ✅ Pass track
      regionSetId={regionSetId}
      trackId={trackId}
      onRegionDetails={handleRegionDetails}
      onEditRegion={handleEditRegion}
      onDeleteRegion={handleDeleteRegion}
      onCreateRegionDrag={handleCreateRegionDrag}
      onCreateRegionClick={handleCreateRegionClick}
    />)
  );
}