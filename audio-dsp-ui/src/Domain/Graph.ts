import type { Edge } from "./Edge";

export interface Graph{
    id:string,
    regionId:string,
    name:string,
    nodes:Node[] | null,
    edges:Edge[]|null,
    createdAt:Date,
    updatedAt:Date
}