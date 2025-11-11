import { useTrackViewModelById } from "@/Selectors/trackViewModels";

import { useWaveformAudio } from "./WaveformAudio";
import type { OpenedContext } from "@/Providers/UIStateProvider";

export function WaveformPlayer({ openedContext }: { openedContext: NonNullable<OpenedContext> }) {
  const trackId = openedContext?.trackId;
  const regionSetId = openedContext.type !== "track" ? openedContext.regionSetId : null;

  const { objectUrl, isLoading } = useWaveformAudio(trackId);
  const track = useTrackViewModelById(trackId); // ✅ Add this

  if (isLoading || !objectUrl || !track) return null;

  return (
    < WaveformRenderer
      url={objectUrl}
      track={track}              // ✅ Pass track
      regionSetId={regionSetId}
      trackId={trackId}
      onRegionDetails={...}
      onEditRegion={...}
      onDeleteRegion={...}
      onCreateRegionDrag={...}
      onCreateRegionClick={...}
    />
  );
}