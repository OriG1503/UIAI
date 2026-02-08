import { Injectable, inject, signal, effect, NgZone } from '@angular/core';
import { MockGraphMailService } from './mock-graph-mail.service';
import { Mail } from '../../shared/types/mail.type';
import { GraphData } from '../../features/search/types/graph-data.type';
import { GraphWorkerResult } from '../../features/search/types/graph-worker-result.type';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private _mockGraphMailService = inject(MockGraphMailService);
  private _ngZone = inject(NgZone);
  private _worker: Worker | null = null;

  readonly $graphData = signal<GraphData>({ nodes: new Map(), edges: [], minEdgeCount: 0, maxEdgeCount: 0 });
  readonly $graphPositions = signal<Record<string, { x: number; y: number }>>({});
  readonly $isLoading = signal(true);

  constructor() {
    if (typeof Worker !== 'undefined') {
      this._worker = new Worker(new URL('../../features/search/workers/graph-builder.worker', import.meta.url));

      this._worker.onmessage = ({ data }: MessageEvent<GraphWorkerResult>) => {
        this._ngZone.run(() => {
          const nodes = new Map(data.nodes);
          this.$graphData.set({
            nodes,
            edges: data.edges,
            minEdgeCount: data.minEdgeCount,
            maxEdgeCount: data.maxEdgeCount
          });
          this.$graphPositions.set(data.positions);
          this.$isLoading.set(false);
        });
      };

      this._worker.onerror = (error) => {
        console.error('Graph worker error:', error);
        this._ngZone.run(() => {
          this.$isLoading.set(false);
        });
      };
    }

    effect(() => {
      const mails = this._mockGraphMailService.mails();
      if (this._worker && mails.length > 0) {
        this.$isLoading.set(true);
        this._worker.postMessage(mails);
      }
    });
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
      if (mail.from.mail !== sourceEmail) {
        return false;
      }
      const recipients = [...mail.to.map((r) => r.mail), ...(mail.cc ?? []).map((r) => r.mail), ...(mail.bcc ?? []).map((r) => r.mail)];
      return recipients.includes(targetEmail);
    });
  }
}
