import type { TrackRegion } from "../Region/TrackRegion";


export interface TrackRegionSet{
    id:string,
    track_id:string,
    name:string,
    regions: TrackRegion[]
}