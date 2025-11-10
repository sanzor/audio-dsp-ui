import type { NormalizedGraph } from "./NormalizedGraph";
import type { Node } from "./Node";
import type { Edge } from "./Edge";

export interface GraphViewModel extends NormalizedGraph {
    nodes: Node[];
    edges: Edge[];
}
