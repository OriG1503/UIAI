import { GraphEdge } from './graph-edge.type';
import { GraphNode } from './graph-node.type';

export type GraphWorkerResult = {
  nodes: [string, GraphNode][];
  edges: GraphEdge[];
  minEdgeCount: number;
  maxEdgeCount: number;
  positions: Record<string, { x: number; y: number }>;
};
