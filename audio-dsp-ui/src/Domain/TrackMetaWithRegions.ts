import type { TrackRegion  } from "./TrackRegion";
import type { TrackMeta } from "./TrackMeta";

export interface TrackMetaWithRegions extends TrackMeta {
  regions: TrackRegion[];
}

