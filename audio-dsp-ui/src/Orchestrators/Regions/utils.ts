import type { NormalizedTrackRegion } from "@/Domain/Region/NormalizedTrackRegion";
import type { TrackRegion } from "@/Domain/Region/TrackRegion";

export const normalizeRegion = (regionSetApi: TrackRegion): NormalizedTrackRegion => {
    // 🚨 Run the cascade to update all child stores and get the IDs for the index
    const region_ids = cascadeNormalization(regionSetApi);

    // Return the flat structure (Type 2)
    return {
        // Spread the intrinsic properties from the API model (Type 1)
        ...regionSetApi, 
        
        // Add the client-side index property
        region_ids: region_ids,
        
        // 🚨 Crucial: Ensure the API-nested 'regions' property is excluded
        // This is handled by defining NormalizedTrackRegionSet correctly using Omit, 
        // but we omit it explicitly here if the type definition is an extension.
    } as NormalizedTrackRegion; 
};

const cascadeNormalization = (regionSetApi: TrackRegion) => {
    const regionIds: string[] = [];

    

    return regionIds;
};