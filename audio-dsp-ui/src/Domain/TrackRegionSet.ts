import type { TrackRegion } from "./TrackRegion";

export interface TrackRegionSet{
    region_set_id:string,
    track_id:string,
    name:string
    regions:Array<TrackRegion>
}