/// <reference lib="webworker" />

import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import { GraphNode } from '../types/graph-node.type';
import { GraphEdge } from '../types/graph-edge.type';
import { GraphWorkerResult } from '../types/graph-worker-result.type';
import { FORCEATLAS2_ITERATIONS, FORCEATLAS2_SETTINGS } from '../constants/graph.constants';

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

  nodes.forEach((node) => {
    graph.addNode(node.email, {
      x: Math.random() * 100,
      y: Math.random() * 100
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
