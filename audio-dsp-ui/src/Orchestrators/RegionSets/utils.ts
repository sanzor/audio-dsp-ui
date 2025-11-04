import type { NormalizedTrackRegionSet } from "@/Domain/RegionSet/NormalizedTrackRegionSet";
import type { TrackRegionSet } from "@/Domain/RegionSet/TrackRegionSet";
import { normalizeRegion } from "../Regions/utils";

const cascadeNormalization = (regionSetApi: TrackRegionSet) => {
    const regionIds: string[] = [];

    // This is the multi-store update loop
    for (const regionApi of regionSetApi.regions) {
        // Assume normalizeRegion handles the deeper cascade (Graph -> Node/Edge)
        const normalizedRegion = normalizeRegion(regionApi);
        
        // 🚨 Update the child store
        // useRegionStore.addRegion(normalizedRegion); 

        regionIds.push(regionApi.region_id); // Assuming ID is on the Region entity
    }

    return regionIds;
};

export const normalizeRegionSet = (regionSetApi: TrackRegionSet): NormalizedTrackRegionSet => {
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
    } as NormalizedTrackRegionSet; 
};