/// <reference lib="webworker" />

import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { GraphNode } from '../../features/graph-canvas/types/graph-node.type';
import { GraphEdge } from '../../features/graph-canvas/types/graph-edge.type';
import { GraphWorkerResult } from '../../features/graph-canvas/types/graph-worker-result.type';
import {
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  FORCEATLAS2_ITERATIONS,
  FORCEATLAS2_SETTINGS,
} from '../../features/graph-canvas/consts/graph.consts';
import { MailUserInfo } from '../../shared/types/mail-user-info.type';
import { WorkerMail } from '../../features/graph-canvas/types/worker-mail.type';

addEventListener('message', ({ data }: MessageEvent<WorkerMail[]>): void => {
  const mails: WorkerMail[] = data;
  const nodes: Map<string, GraphNode> = new Map<string, GraphNode>();
  const edgeMap: Map<string, GraphEdge> = new Map<string, GraphEdge>();

  const addNode = (user: MailUserInfo): void => {
    const email: string = user.mail ?? '';
    if (!email) {
      return;
    }
    if (!nodes.has(email)) {
      nodes.set(email, { email, username: user.username ?? email, mailCount: 0, degree: 0 });
    }
  };

  const incrementNodeCount = (email: string): void => {
    const node: GraphNode | undefined = nodes.get(email);
    if (node) {
      node.mailCount++;
    }
  };

  const addEdge = (fromEmail: string, toEmail: string): void => {
    if (!fromEmail || !toEmail || fromEmail === toEmail) {
      return;
    }
    const key: string = `${fromEmail}|${toEmail}`;
    const existing: GraphEdge | undefined = edgeMap.get(key);
    if (existing) {
      existing.mailCount++;
    } else {
      edgeMap.set(key, { sourceEmail: fromEmail, targetEmail: toEmail, mailCount: 1 });
    }
  };

  mails.forEach((mail: WorkerMail) => {
    const fromEmail: string = mail.from.mail ?? '';
    addNode(mail.from);
    incrementNodeCount(fromEmail);

    const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];

    recipients.forEach((recipient: MailUserInfo) => {
      addNode(recipient);
      incrementNodeCount(recipient.mail ?? '');
      addEdge(fromEmail, recipient.mail ?? '');
    });
  });

  const edges: GraphEdge[] = Array.from(edgeMap.values());
  const edgeCounts: number[] = edges.map((edge: GraphEdge) => edge.mailCount);
  const minEdgeCount: number = edgeCounts.length > 0 ? Math.min(...edgeCounts) : 0;
  const maxEdgeCount: number = edgeCounts.length > 0 ? Math.max(...edgeCounts) : 0;

  edges.forEach((edge: GraphEdge) => {
    const sourceNode: GraphNode | undefined = nodes.get(edge.sourceEmail);
    const targetNode: GraphNode | undefined = nodes.get(edge.targetEmail);
    if (sourceNode) {
      sourceNode.degree++;
    }
    if (targetNode) {
      targetNode.degree++;
    }
  });

  const graph: Graph = new Graph();
  const maxMailCount: number = Math.max(...Array.from(nodes.values()).map((node: GraphNode) => node.mailCount), 1);

  nodes.forEach((node: GraphNode) => {
    const sizeRatio: number = node.mailCount / maxMailCount;
    const size: number = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
    graph.addNode(node.email, {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      size,
    });
  });

  edges.forEach((edge: GraphEdge) => {
    if (graph.hasNode(edge.sourceEmail) && graph.hasNode(edge.targetEmail)) {
      graph.addDirectedEdge(edge.sourceEmail, edge.targetEmail);
    }
  });

  forceAtlas2.assign(graph, {
    iterations: FORCEATLAS2_ITERATIONS,
    settings: FORCEATLAS2_SETTINGS,
  });

  const positions: Record<string, { x: number; y: number }> = {};
  // TODO: define proper GraphNodeAttributes type for Graphology forEachNode callback
  graph.forEachNode((node: string, attrs: Record<string, unknown>) => {
    positions[node] = { x: attrs['x'] as number, y: attrs['y'] as number };
  });

  const result: GraphWorkerResult = {
    nodes: Array.from(nodes.entries()),
    edges,
    minEdgeCount,
    maxEdgeCount,
    positions,
  };

  postMessage(result);
});
