// /src/Domain/Region/mappers.ts

import type { NormalizedTrackRegion } from "./NormalizedTrackRegion";
import type { TrackRegionViewModel } from "./TrackRegionViewModel";


export function normalizeRegion(region: TrackRegionViewModel): NormalizedTrackRegion {
  return {
    region_id: region.region_id,
    region_set_id: region.region_set_id,
    name: region.name,
    // ...any scalar fields
    graphId: region.graph?.id ?? null,  // store child IDs, not objects
    start:region.start,
    end:region.end
  };
}