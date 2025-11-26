import { useRegionSetViewModel, useTrackViewModelById } from "@/Selectors/trackViewModels";
import { useWaveformAudio } from "./WaveformAudio";
import { WaveformRenderer } from "./WaveformRenderer";
import { useUIStore } from "@/Stores/UIStore";
import { useRegionSetStore } from "@/Stores/RegionSetStore";

export interface WaveformPlayerProps {

  onRegionDetails: (regionId: string) => void;
  onDeleteRegion: (regionId: string) => void;
  onEditRegion: (regionId: string) => void;
  onCopyRegion: (regionId: string) => void;
  onCreateRegionClick: (regionSetId:string,time: number) => void;
  onCreateRegionDrag: (regionSetId:string,start: number, end: number) => void;
}

export function WaveformPlayer({
  onRegionDetails,
  onDeleteRegion,
  onEditRegion,
  onCopyRegion,
  onCreateRegionClick,
  onCreateRegionDrag
}: WaveformPlayerProps) {
  const openedContext=useUIStore(x=>x.openedContext);

  if(openedContext?.type !== "regionSet" ){
    return null;
  }
  const regionSet=useRegionSetStore(x=>x.regionSets.get(openedContext.regionSetId));

  const trackId = openedContext.trackId;
  const { objectUrl, isLoading } = useWaveformAudio(trackId);
  const track = useTrackViewModelById(trackId);
  const regionSet = useRegionSetViewModel(trackId, regionSetId);

  if (isLoading || !objectUrl || !track || !regionSet) return null;

  return (
    <WaveformRenderer
      url={objectUrl}
      regionSet={regionSet}
      onRegionDetails={onRegionDetails}
      onEditRegion={onEditRegion}
      onDeleteRegion={onDeleteRegion}
      onCopyRegion={onCopyRegion}
      onCreateRegionClick={(time)=>onCreateRegionClick(regionSetId,time)}
      onCreateRegionDrag={(start,end)=>onCreateRegionDrag(regionSetId,start,end)}
    />
  );
}
