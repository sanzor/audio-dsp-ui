import type { Graph } from "./Graph"

export interface NormalizedGraph extends Graph{
    nodes_ids:string[] |null
    edges_ids:string[]|null
}