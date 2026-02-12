import { GraphNode } from './graph-node.type';
import { GraphEdge } from './graph-edge.type';

export type GraphData = {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  minEdgeCount: number;
  maxEdgeCount: number;
};
