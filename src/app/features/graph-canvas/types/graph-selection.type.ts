export type GraphSelection = {
  type: 'node' | 'edge' | 'none';
  nodeEmail?: string;
  edgeSourceEmail?: string;
  edgeTargetEmail?: string;
};
