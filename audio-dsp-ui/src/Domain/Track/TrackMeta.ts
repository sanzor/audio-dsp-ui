import type { TrackRegionSet } from "../RegionSet/TrackRegionSet";
import type { TrackInfo } from "./TrackInfo";

export interface TrackMeta{
    track_info:TrackInfo,
    track_id:string
    regionSets:TrackRegionSet[]
}