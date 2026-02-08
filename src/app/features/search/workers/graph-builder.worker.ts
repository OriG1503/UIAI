/// <reference lib="webworker" />

import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { GraphNode } from '../types/graph-node.type';
import { GraphEdge } from '../types/graph-edge.type';
import { GraphWorkerResult } from '../types/graph-worker-result.type';
import {
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  FORCEATLAS2_ITERATIONS,
  FORCEATLAS2_SETTINGS
} from '../constants/graph.constants';

type MailUserInfo = {
  mail?: string;
  tag?: string;
  username?: string;
};

type WorkerMail = {
  from: { mail?: string; username?: string };
  to: MailUserInfo[];
  cc?: MailUserInfo[];
  bcc?: MailUserInfo[];
};

addEventListener('message', ({ data }: MessageEvent<WorkerMail[]>) => {
  const mails = data;
  const nodes = new Map<string, GraphNode>();
  const edgeMap = new Map<string, GraphEdge>();

  const addNode = (user: MailUserInfo): void => {
    const email = user.mail ?? '';
    if (!email) {
      return;
    }
    if (!nodes.has(email)) {
      nodes.set(email, { email, username: user.username ?? email, mailCount: 0, rank: 0 });
    }
  };

  const incrementNodeCount = (email: string): void => {
    const node = nodes.get(email);
    if (node) {
      node.mailCount++;
    }
  };

  const addEdge = (fromEmail: string, toEmail: string): void => {
    if (!fromEmail || !toEmail || fromEmail === toEmail) {
      return;
    }
    const key = `${fromEmail}|${toEmail}`;
    const existing = edgeMap.get(key);
    if (existing) {
      existing.mailCount++;
    } else {
      edgeMap.set(key, { sourceEmail: fromEmail, targetEmail: toEmail, mailCount: 1 });
    }
  };

  mails.forEach((mail) => {
    const fromEmail = mail.from.mail ?? '';
    addNode(mail.from);
    incrementNodeCount(fromEmail);

    const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];

    recipients.forEach((recipient) => {
      addNode(recipient);
      incrementNodeCount(recipient.mail ?? '');
      addEdge(fromEmail, recipient.mail ?? '');
    });
  });

  const edges = Array.from(edgeMap.values());
  const edgeCounts = edges.map((e) => e.mailCount);
  const minEdgeCount = edgeCounts.length > 0 ? Math.min(...edgeCounts) : 0;
  const maxEdgeCount = edgeCounts.length > 0 ? Math.max(...edgeCounts) : 0;

  edges.forEach((edge) => {
    const sourceNode = nodes.get(edge.sourceEmail);
    const targetNode = nodes.get(edge.targetEmail);
    if (sourceNode) {
      sourceNode.rank++;
    }
    if (targetNode) {
      targetNode.rank++;
    }
  });

  const graph = new Graph();
  const maxMailCount = Math.max(...Array.from(nodes.values()).map((n) => n.mailCount), 1);

  nodes.forEach((node) => {
    const sizeRatio = node.mailCount / maxMailCount;
    const size = NODE_SIZE_MIN + sizeRatio * (NODE_SIZE_MAX - NODE_SIZE_MIN);
    graph.addNode(node.email, {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      size
    });
  });

  edges.forEach((edge) => {
    if (graph.hasNode(edge.sourceEmail) && graph.hasNode(edge.targetEmail)) {
      graph.addDirectedEdge(edge.sourceEmail, edge.targetEmail);
    }
  });

  forceAtlas2.assign(graph, {
    iterations: FORCEATLAS2_ITERATIONS,
    settings: FORCEATLAS2_SETTINGS
  });

  const OVERLAP_PADDING = 4;
  const OVERLAP_PASSES = 20;
  const nodeEntries = Array.from(nodes.keys());

  Array.from({ length: OVERLAP_PASSES }).forEach(() => {
    nodeEntries.forEach((nodeA, i) => {
      const ax = graph.getNodeAttribute(nodeA, 'x') as number;
      const ay = graph.getNodeAttribute(nodeA, 'y') as number;
      const aSize = graph.getNodeAttribute(nodeA, 'size') as number;

      nodeEntries.slice(i + 1).forEach((nodeB) => {
        const bx = graph.getNodeAttribute(nodeB, 'x') as number;
        const by = graph.getNodeAttribute(nodeB, 'y') as number;
        const bSize = graph.getNodeAttribute(nodeB, 'size') as number;

        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (aSize + bSize) * OVERLAP_PADDING;

        if (dist < minDist && dist > 0) {
          const overlap = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;

          graph.setNodeAttribute(nodeA, 'x', ax - ux * overlap);
          graph.setNodeAttribute(nodeA, 'y', ay - uy * overlap);
          graph.setNodeAttribute(nodeB, 'x', bx + ux * overlap);
          graph.setNodeAttribute(nodeB, 'y', by + uy * overlap);
        }
      });
    });
  });

  const positions: Record<string, { x: number; y: number }> = {};
  graph.forEachNode((node, attrs) => {
    positions[node] = { x: attrs['x'] as number, y: attrs['y'] as number };
  });

  const result: GraphWorkerResult = {
    nodes: Array.from(nodes.entries()),
    edges,
    minEdgeCount,
    maxEdgeCount,
    positions
  };

  postMessage(result);
});
