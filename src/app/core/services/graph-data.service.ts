import { Injectable, inject, signal, NgZone, WritableSignal } from '@angular/core';
import { MockGraphMailService } from './mock-graph-mail.service';
import { Mail } from '../../shared/types/mail.type';
import { GraphData } from '../../features/graph-canvas/types/graph-data.type';
import { GraphWorkerResult } from '../../features/graph-canvas/types/graph-worker-result.type';
import { GraphNode } from '../../features/graph-canvas/types/graph-node.type';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private _mockGraphMailService: MockGraphMailService = inject(MockGraphMailService);
  private _ngZone: NgZone = inject(NgZone);
  private _worker: Worker | null = null;
  private _isGraphBuilt: boolean = false;

  readonly $graphData: WritableSignal<GraphData> = signal<GraphData>({
    nodes: new Map(),
    edges: [],
    minEdgeCount: 0,
    maxEdgeCount: 0,
  });
  readonly $graphPositions: WritableSignal<Record<string, { x: number; y: number }>> = signal<
    Record<string, { x: number; y: number }>
  >({});
  readonly $isLoading: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../workers/graph-builder.worker', import.meta.url));

      this._worker.onmessage = ({ data }: MessageEvent<GraphWorkerResult>): void => {
        this._ngZone.run((): void => {
          const nodes: Map<string, GraphNode> = new Map(data.nodes);
          this.$graphData.set({
            nodes,
            edges: data.edges,
            minEdgeCount: data.minEdgeCount,
            maxEdgeCount: data.maxEdgeCount,
          });
          this.$graphPositions.set(data.positions);
          this.$isLoading.set(false);
          this._isGraphBuilt = true;
        });
      };

      this._worker.onerror = (error: ErrorEvent): void => {
        console.error('Graph worker error:', error);
        this._ngZone.run((): void => {
          this.$isLoading.set(false);
        });
      };
    }

    this._buildGraphOnce();
  }

  private _buildGraphOnce(): void {
    const mails: Mail[] = this._mockGraphMailService.mails();
    if (this._worker && mails.length > 0 && !this._isGraphBuilt) {
      this.$isLoading.set(true);
      this._worker.postMessage(mails);
    }
  }

  public getMailsForNode(email: string): Mail[] {
    return this._mockGraphMailService.mails().filter((mail: Mail): boolean => {
      if (mail.from.mail === email) {
        return true;
      }
      if (mail.to.some((recipient: { mail?: string }) => recipient.mail === email)) {
        return true;
      }
      if (mail.cc?.some((recipient: { mail?: string }) => recipient.mail === email)) {
        return true;
      }
      if (mail.bcc?.some((recipient: { mail?: string }) => recipient.mail === email)) {
        return true;
      }
      return false;
    });
  }

  public getMailsForEdge(sourceEmail: string, targetEmail: string): Mail[] {
    return this._mockGraphMailService.mails().filter((mail: Mail): boolean => {
      if (mail.from.mail !== sourceEmail) {
        return false;
      }
      const recipients: (string | undefined)[] = [
        ...mail.to.map((recipient: { mail?: string }) => recipient.mail),
        ...(mail.cc ?? []).map((recipient: { mail?: string }) => recipient.mail),
        ...(mail.bcc ?? []).map((recipient: { mail?: string }) => recipient.mail),
      ];
      return recipients.includes(targetEmail);
    });
  }
}
