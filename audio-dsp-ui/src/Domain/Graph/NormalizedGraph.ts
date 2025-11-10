import type { Graph } from "./Graph"

export interface NormalizedGraph extends Omit<Graph, 'nodes' | 'edges'> {
    nodes_ids:string[]
    edges_ids:string[]
}
