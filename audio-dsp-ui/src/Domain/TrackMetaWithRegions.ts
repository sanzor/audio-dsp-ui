import type { Region } from "./Region";
import type { TrackMeta } from "./TrackMeta";

export interface TrackMetaWithRegions extends TrackMeta {
  regions: Region[];
}

