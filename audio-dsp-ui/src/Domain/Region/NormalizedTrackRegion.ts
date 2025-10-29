import type { TrackRegion } from "./TrackRegion";

export interface NormalizedTrackRegion extends TrackRegion{
    region_set_id:string,
    graphId:string
}