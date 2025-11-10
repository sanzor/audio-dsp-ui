import type { Edge } from "./Edge";
import type { Node } from "./Node";

export interface Graph{
    id:string,
    name:string,
    createdAt:Date,
    updatedAt:Date,
    nodes: Node[];
    edges: Edge[];
}
