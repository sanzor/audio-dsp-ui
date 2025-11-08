import type { Edge } from "./Edge";
import type { Graph } from "./Graph";
import type { Node } from "./Node";

export interface GraphViewModel extends Graph {
    nodes: Node[] | null;
    edges: Edge[] | null;
}
