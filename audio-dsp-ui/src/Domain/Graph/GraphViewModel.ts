import type { Edge } from "./Edge";
import type { Graph } from "./Graph";

export interface GraphViewModel extends Graph{
    nodes:Node[] |null
    edges:Edge[]|null
}