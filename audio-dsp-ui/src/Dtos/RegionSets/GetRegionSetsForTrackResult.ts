import type { TrackRegionSet } from "@/Domain/TrackRegionSet";

export interface GetRegionSetsForTrackResult{
    trackId:string,
    sets:TrackRegionSet[]
}