import type { TrackRegionSet } from "./TrackRegionSet";

export interface NormalizedTrackRegionSet extends TrackRegionSet{
    trackId:string,
    region_sets_ids:string[]
}