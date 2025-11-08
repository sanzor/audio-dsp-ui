
import type { Graph } from "../Graph/Graph";
import type { TrackRegion } from "./TrackRegion";

export interface TrackRegionViewModel extends TrackRegion {
    graph?: Graph | null;
}
