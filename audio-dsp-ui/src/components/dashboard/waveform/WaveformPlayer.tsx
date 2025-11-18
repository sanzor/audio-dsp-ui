import { useRegionSetViewModel, useTrackViewModelById } from "@/Selectors/trackViewModels";
import { useWaveformAudio } from "./WaveformAudio";
import type { OpenedContext } from "@/Providers/UIStore/UIStateProvider";
import { WaveformRenderer } from "./WaveformRenderer";

export interface WaveformPlayerProps {
  openedContext: NonNullable<OpenedContext>;

  onRegionDetails: (regionId: string) => void;
  onDeleteRegion: (regionId: string) => void;
  onEditRegion: (regionId: string) => void;
  onCopyRegion: (regionId: string) => void;
  onCreateRegionClick: (time: number) => void;
  onCreateRegionDrag: (start: number, end: number) => void;
}

export function WaveformPlayer({
  openedContext,
  onRegionDetails,
  onDeleteRegion,
  onEditRegion,
  onCopyRegion,
  onCreateRegionClick,
  onCreateRegionDrag
}: WaveformPlayerProps) {

  const trackId = openedContext.trackId;
  const regionSetId = openedContext.type === "regionSet" ? openedContext.regionSetId : null;

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
      onCreateRegionClick={onCreateRegionClick}
      onCreateRegionDrag={onCreateRegionDrag}
    />
  );
}
