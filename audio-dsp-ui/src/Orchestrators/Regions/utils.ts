import type { NormalizedTrackRegion } from "@/Domain/Region/NormalizedTrackRegion";
import type { TrackRegion } from "@/Domain/Region/TrackRegion";

export const normalizeRegion = (regionSetApi: TrackRegion): NormalizedTrackRegion => {
    // 🚨 Run the cascade to update all child stores and get the IDs for the index

    // Return the flat structure (Type 2)
    return {
        // Spread the intrinsic properties from the API model (Type 1)
        ...regionSetApi, 
        graphId:regionSetApi.graph?.id,
    } as NormalizedTrackRegion; 
};

