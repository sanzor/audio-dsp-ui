import { useTrackViewModelById } from "@/Selectors/trackViewModels";
import { useWaveformAudio } from "./WaveformAudio";
import { WaveformRenderer } from "./WaveformRenderer";
import { useUIStore } from "@/Stores/UIStore";
import { useRegionSetStore } from "@/Stores/RegionSetStore";

// Assuming onRegionDetails, onEditRegion, etc., are defined/imported
// ... (or passed as props)

export function WaveformPlayer() {
  // 1. CALL ALL HOOKS AT THE TOP LEVEL (UNCONDITIONAL)

  // Get UI context
  const openedContext = useUIStore(x => x.openedContext);
  
  // Safely determine the regionSetId
  const regionSetId = openedContext?.type === "regionSet" ? openedContext.regionSetId : undefined;
  
  // Get RegionSet object (Hook 2)
  // Selector: Only try to get the RegionSet if we have a valid ID
  const regionSet = useRegionSetStore(x => 
    regionSetId ? x.regionSets.get(regionSetId) : undefined
  ); 

  // Safely derive trackId from the RegionSet
  const trackId = regionSet?.trackId; 
  
  // Get Track View Model (Hook 3) - Use this one, not useTrackStore
  // The hook must be called even if trackId is null/undefined
  const track = useTrackViewModelById(trackId); 
  
  // Get Audio URL (Hook 4) - Pass trackId directly
  // The hook must be called even if trackId is null/undefined
  const { objectUrl, isLoading } = useWaveformAudio(trackId!==undefined?trackId:null); 

  // 2. NOW, PERFORM ALL CONDITIONAL CHECKS/EARLY EXITS

  // Check 1: Is the correct context open?
  if (openedContext?.type !== "regionSet") {
    return null;
  }
  
  // Check 2: Do we have all the required data?
  // trackId is guaranteed to be a string here since it comes from regionSet.trackId
  // which is required for the rest of the logic.
  if (isLoading || !objectUrl || !track || !regionSet || !trackId) {
    return null;
  }

  // 3. RENDER THE COMPONENT

  return (
    <WaveformRenderer
      url={objectUrl}
      regionSet={regionSet}
      // Assuming these functions are defined/imported
      // You may need to define or import these locally:
      /*
      onRegionDetails={onRegionDetails}
      onEditRegion={onEditRegion}
      onDeleteRegion={onDeleteRegion}
      onCopyRegion={onCopyRegion}
      onCreateRegionClick={(time)=>onCreateRegionClick(regionSetId,time)}
      onCreateRegionDrag={(start,end)=>onCreateRegionDrag(regionSetId,start,end)}
      */
    />
  );
}