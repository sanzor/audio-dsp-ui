
import type { GraphViewModel } from "../Graph/GraphViewModel";
import type { TrackRegion } from "./TrackRegion";

export interface TrackRegionViewModel extends Omit<TrackRegion,"graph"> {
    graph: GraphViewModel | null;
}
