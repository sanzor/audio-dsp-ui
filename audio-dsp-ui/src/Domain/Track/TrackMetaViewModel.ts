import type { TrackRegionSet } from "../RegionSet/TrackRegionSet";
import type { TrackMeta } from "./TrackMeta";

export interface TrackMetaViewModel extends TrackMeta{
    region_sets:TrackRegionSet[]
}