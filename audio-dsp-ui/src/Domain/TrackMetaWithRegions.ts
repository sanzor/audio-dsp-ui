import type { TrackRegion  } from "./Region/TrackRegion";
import type { TrackMeta } from "./Track/TrackMeta";

export interface TrackMetaWithRegions extends TrackMeta {
  regions: TrackRegion[];
}

