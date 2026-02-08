import { Injectable, inject, computed } from '@angular/core';
import { MockGraphMailService } from './mock-graph-mail.service';
import { Mail } from '../../shared/types/mail.type';
import { MailUserInfo } from '../../shared/types/mail-user-info.type';
import { GraphNode } from '../../features/search/types/graph-node.type';
import { GraphEdge } from '../../features/search/types/graph-edge.type';
import { GraphData } from '../../features/search/types/graph-data.type';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private _mockGraphMailService = inject(MockGraphMailService);

  readonly $graphData = computed<GraphData>(() => this._buildGraphData(this._mockGraphMailService.mails()));

  private _buildGraphData(mails: Mail[]): GraphData {
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

      const recipients: MailUserInfo[] = [
        ...mail.to,
        ...(mail.cc ?? []),
        ...(mail.bcc ?? [])
      ];

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

    return { nodes, edges, minEdgeCount, maxEdgeCount };
  }

  public getMailsForNode(email: string): Mail[] {
    return this._mockGraphMailService.mails().filter((mail) => {
      if (mail.from.mail === email) {
        return true;
      }
      if (mail.to.some((r) => r.mail === email)) {
        return true;
      }
      if (mail.cc?.some((r) => r.mail === email)) {
        return true;
      }
      if (mail.bcc?.some((r) => r.mail === email)) {
        return true;
      }
      return false;
    });
  }

  public getMailsForEdge(sourceEmail: string, targetEmail: string): Mail[] {
    return this._mockGraphMailService.mails().filter((mail) => {
      const allParticipants = [
        mail.from.mail,
        ...mail.to.map((r) => r.mail),
        ...(mail.cc ?? []).map((r) => r.mail),
        ...(mail.bcc ?? []).map((r) => r.mail)
      ];
      return allParticipants.includes(sourceEmail) && allParticipants.includes(targetEmail);
    });
  }
}
