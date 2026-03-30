import { Injectable, inject, signal, NgZone, WritableSignal } from '@angular/core';
import { MockGraphMailService } from './mock-graph-mail.service';
import { Mail } from '../../shared/types/mail.type';
import { MailUserInfo } from '../../shared/types/mail-user-info.type';
import { GraphData } from '../../features/graph-canvas/types/graph-data.type';
import { GraphWorkerResult } from '../../features/graph-canvas/types/graph-worker-result.type';
import { GraphNode } from '../../features/graph-canvas/types/graph-node.type';
import { GRAPH_FIRST_LOAD_MIN_MAIL_COUNT } from '../../features/graph-canvas/consts/graph.consts';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private _mockGraphMailService: MockGraphMailService = inject(MockGraphMailService);
  private _ngZone: NgZone = inject(NgZone);
  private _firstLoadWorker: Worker | null = null;
  private _fullLoadWorker: Worker | null = null;

  public readonly $graphData: WritableSignal<GraphData> = signal<GraphData>({
    nodes: new Map(),
    edges: [],
    minEdgeCount: 0,
    maxEdgeCount: 0,
  });
  public readonly $graphPositions: WritableSignal<Record<string, { x: number; y: number }>> = signal<
    Record<string, { x: number; y: number }>
  >({});
  public readonly $isLoading: WritableSignal<boolean> = signal<boolean>(true);
  public readonly $isFullLoadDone: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    if (typeof Worker !== 'undefined') {
      this._firstLoadWorker = new Worker(new URL('../workers/graph-builder.worker', import.meta.url));
      this._fullLoadWorker = new Worker(new URL('../workers/graph-builder.worker', import.meta.url));

      this._firstLoadWorker.onmessage = ({ data }: MessageEvent<GraphWorkerResult>): void => {
        this._ngZone.run((): void => {
          this.$graphData.set({
            nodes: new Map(data.nodes),
            edges: data.edges,
            minEdgeCount: data.minEdgeCount,
            maxEdgeCount: data.maxEdgeCount,
          });
          this.$graphPositions.set(data.positions);
          this.$isLoading.set(false);
        });
      };

      this._firstLoadWorker.onerror = (): void => {
        this._ngZone.run((): void => {
          this.$isLoading.set(false);
        });
      };

      this._fullLoadWorker.onmessage = ({ data }: MessageEvent<GraphWorkerResult>): void => {
        this._ngZone.run((): void => {
          this.$graphData.set({
            nodes: new Map(data.nodes),
            edges: data.edges,
            minEdgeCount: data.minEdgeCount,
            maxEdgeCount: data.maxEdgeCount,
          });
          this.$graphPositions.set(data.positions);
          this.$isFullLoadDone.set(true);
        });
      };

      this._fullLoadWorker.onerror = (): void => {
        this._ngZone.run((): void => {
          this.$isFullLoadDone.set(true);
        });
      };
    }

    this._startLoading();
  }

  private _startLoading(): void {
    const allMails: Mail[] = this._mockGraphMailService.mails();

    if (!this._firstLoadWorker || !this._fullLoadWorker || allMails.length === 0) {
      this.$isLoading.set(false);
      this.$isFullLoadDone.set(true);
      return;
    }

    const mailCounts: Map<string, number> = new Map<string, number>();
    allMails.forEach((mail: Mail): void => {
      const fromEmail: string = mail.from.mail ?? '';
      if (fromEmail) {
        mailCounts.set(fromEmail, (mailCounts.get(fromEmail) ?? 0) + 1);
      }
      const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];
      recipients.forEach((recipient: MailUserInfo): void => {
        const email: string = recipient.mail ?? '';
        if (email) {
          mailCounts.set(email, (mailCounts.get(email) ?? 0) + 1);
        }
      });
    });

    const activeUsers: Set<string> = new Set<string>(
      Array.from(mailCounts.entries())
        .filter(([, count]: [string, number]) => count >= GRAPH_FIRST_LOAD_MIN_MAIL_COUNT)
        .map(([email]: [string, number]) => email),
    );

    const firstLoadMails: Mail[] = allMails.filter((mail: Mail) => activeUsers.has(mail.from.mail ?? ''));
    const mailsForFirstLoad: Mail[] = firstLoadMails.length > 0 ? firstLoadMails : allMails;

    this.$isLoading.set(true);
    this._firstLoadWorker.postMessage(mailsForFirstLoad);
    this._fullLoadWorker.postMessage(allMails);
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
