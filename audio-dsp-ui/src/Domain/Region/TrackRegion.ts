import type { Graph } from "../Graph/Graph";

export interface TrackRegion{
    region_id:string,
    region_set_id:string,
    name:string,
    start:number,
    end:number,
    graph:Graph|undefined
}