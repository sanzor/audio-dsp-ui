import type { TrackRegionSet } from "@/Domain/TrackRegionSet";

export interface GetRegionSetsResult{
    track_region_sets_map:Map<string,TrackRegionSet[]>
}