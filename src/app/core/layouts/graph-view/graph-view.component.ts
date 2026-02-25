import { Component, inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { GraphDataService } from '../../services/graph-data.service';
import { MockGraphMailService } from '../../services/mock-graph-mail.service';
import { SelectedMailService } from '../../services/selected-mail.service';
import { GraphSelection } from '../../../features/graph-canvas/types/graph-selection.type';
import { GraphNode } from '../../../features/graph-canvas/types/graph-node.type';
import { GraphData } from '../../../features/graph-canvas/types/graph-data.type';
import { Mail } from '../../../shared/types/mail.type';
import { MailUserInfo } from '../../../shared/types/mail-user-info.type';
import { GraphCanvasComponent } from '../../../features/graph-canvas/components/organisms/graph-canvas/graph-canvas.component';
import { GraphDrawerComponent } from '../../../features/graph-canvas/components/organisms/graph-drawer/graph-drawer.component';
import { GraphFiltersPanelComponent } from '../../../features/graph-filters/components/molecules/graph-filters-panel/graph-filters-panel.component';
import { GRAPH_LABEL_MAP } from '../../../features/graph-canvas/mapping/graph.label-map';

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [GraphCanvasComponent, GraphDrawerComponent, GraphFiltersPanelComponent],
  templateUrl: './graph-view.component.html',
  styleUrl: './graph-view.component.scss',
})
export class GraphViewComponent {
  private _graphDataService: GraphDataService = inject(GraphDataService);
  private _mockGraphMailService: MockGraphMailService = inject(MockGraphMailService);
  private _selectedMailService: SelectedMailService = inject(SelectedMailService);

  public readonly $graphData: WritableSignal<GraphData> = this._graphDataService.$graphData;
  public readonly $graphPositions: WritableSignal<Record<string, { x: number; y: number }>> =
    this._graphDataService.$graphPositions;
  public readonly $isLoading: WritableSignal<boolean> = this._graphDataService.$isLoading;
  public readonly translations: typeof GRAPH_LABEL_MAP = GRAPH_LABEL_MAP;

  public $selection: WritableSignal<GraphSelection> = signal<GraphSelection>({ type: 'none' });
  public $isDrawerOpen: WritableSignal<boolean> = signal<boolean>(false);
  public $hoveredNodeEmail: WritableSignal<string | null> = signal<string | null>(null);

  public $dateMin: Signal<number> = computed<number>(() => {
    const mails: Mail[] = this._mockGraphMailService.mails();
    if (mails.length === 0) {
      return 0;
    }
    return Math.min(...mails.map((mail: Mail) => new Date(mail.sent).getTime()));
  });

  public $dateMax: Signal<number> = computed<number>(() => {
    const mails: Mail[] = this._mockGraphMailService.mails();
    if (mails.length === 0) {
      return 0;
    }
    return Math.max(...mails.map((mail: Mail) => new Date(mail.sent).getTime()));
  });

  public $dateRangeValues: WritableSignal<number[]> = signal<number[]>([0, 0]);

  public $mailCountRangeValues: WritableSignal<number[]> = signal<number[]>([1, 1]);

  private _$dateFilteredMails: Signal<Mail[]> = computed<Mail[]>(() => {
    const mails: Mail[] = this._mockGraphMailService.mails();
    const [min, max]: number[] = this.$dateRangeValues();
    return mails.filter((mail: Mail) => {
      const t: number = new Date(mail.sent).getTime();
      return t >= min && t <= max;
    });
  });

  private _$filteredNodeCounts: Signal<Map<string, number>> = computed<Map<string, number>>(() => {
    const mails: Mail[] = this._$dateFilteredMails();
    const counts: Map<string, number> = new Map<string, number>();

    mails.forEach((mail: Mail) => {
      const fromEmail: string = mail.from.mail ?? '';
      if (fromEmail) {
        counts.set(fromEmail, (counts.get(fromEmail) ?? 0) + 1);
      }

      const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];
      recipients.forEach((recipient: MailUserInfo) => {
        const email: string = recipient.mail ?? '';
        if (email) {
          counts.set(email, (counts.get(email) ?? 0) + 1);
        }
      });
    });

    return counts;
  });

  public $mailCountMax: Signal<number> = computed<number>(() => {
    const mails: Mail[] = this._mockGraphMailService.mails();
    if (mails.length === 0) {
      return 1;
    }
    const counts: Map<string, number> = new Map<string, number>();
    mails.forEach((mail: Mail) => {
      const fromEmail: string = mail.from.mail ?? '';
      if (fromEmail) {
        counts.set(fromEmail, (counts.get(fromEmail) ?? 0) + 1);
      }
      const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];
      recipients.forEach((recipient: MailUserInfo) => {
        const email: string = recipient.mail ?? '';
        if (email) {
          counts.set(email, (counts.get(email) ?? 0) + 1);
        }
      });
    });
    return Math.max(...Array.from(counts.values()));
  });

  public $visibleNodeEmails: Signal<Set<string>> = computed<Set<string>>(() => {
    const counts: Map<string, number> = this._$filteredNodeCounts();
    const [min, max]: number[] = this.$mailCountRangeValues();
    const visible: Set<string> = new Set<string>();

    counts.forEach((count: number, email: string) => {
      if (count >= min && count <= max) {
        visible.add(email);
      }
    });

    return visible;
  });

  public $nodeList: Signal<GraphNode[]> = computed<GraphNode[]>(() => {
    const allNodes: Map<string, GraphNode> = this.$graphData().nodes;
    const counts: Map<string, number> = this._$filteredNodeCounts();
    const [min, max]: number[] = this.$mailCountRangeValues();

    return Array.from(allNodes.values())
      .filter((node: GraphNode) => {
        const count: number = counts.get(node.email) ?? 0;
        return count >= min && count <= max;
      })
      .map((node: GraphNode) => ({
        ...node,
        mailCount: counts.get(node.email) ?? 0,
      }));
  });

  public $selectedNodeEmail: Signal<string | null> = computed<string | null>(() => {
    const sel: GraphSelection = this.$selection();
    if (sel.type === 'node') {
      return sel.nodeEmail ?? null;
    }
    return null;
  });

  public $filteredMails: Signal<Mail[]> = computed<Mail[]>(() => {
    const sel: GraphSelection = this.$selection();
    if (sel.type === 'node' && sel.nodeEmail) {
      return this._graphDataService.getMailsForNode(sel.nodeEmail);
    }
    if (sel.type === 'edge' && sel.edgeSourceEmail && sel.edgeTargetEmail) {
      return this._graphDataService.getMailsForEdge(sel.edgeSourceEmail, sel.edgeTargetEmail);
    }
    return [];
  });

  constructor() {
    const dateMin: number = this.$dateMin();
    const dateMax: number = this.$dateMax();
    this.$dateRangeValues.set([dateMin, dateMax]);

    const mailCountMax: number = this.$mailCountMax();
    this.$mailCountRangeValues.set([1, mailCountMax]);
  }

  public onNodeClick(email: string): void {
    const current: GraphSelection = this.$selection();
    if (current.type === 'node' && current.nodeEmail === email) {
      this.$selection.set({ type: 'none' });
      this.$isDrawerOpen.set(false);
      this._selectedMailService.clearSelectedMail();
      return;
    }
    this.$selection.set({ type: 'node', nodeEmail: email });
    this.$isDrawerOpen.set(true);
    this._selectedMailService.clearSelectedMail();
  }

  public onEdgeClick(event: { source: string; target: string }): void {
    this.$selection.set({
      type: 'edge',
      edgeSourceEmail: event.source,
      edgeTargetEmail: event.target,
    });
    this.$isDrawerOpen.set(true);
    this._selectedMailService.clearSelectedMail();
  }

  public onStageClick(): void {
    this.$selection.set({ type: 'none' });
    this.$isDrawerOpen.set(false);
    this._selectedMailService.clearSelectedMail();
  }

  public onDateRangeChange(values: number[]): void {
    const newMin: number = Math.max(this.$dateMin(), Math.min(values[0], values[1]));
    const newMax: number = Math.min(this.$dateMax(), Math.max(values[0], values[1]));
    if (newMin >= newMax) {
      return;
    }
    this.$dateRangeValues.set([newMin, newMax]);
  }

  public onMailCountRangeChange(values: number[]): void {
    const newMin: number = Math.max(1, Math.min(values[0], values[1]));
    const newMax: number = Math.min(this.$mailCountMax(), Math.max(values[0], values[1]));
    if (newMin >= newMax) {
      return;
    }
    this.$mailCountRangeValues.set([newMin, newMax]);
  }

  public onRestoreFilters(): void {
    this.$dateRangeValues.set([this.$dateMin(), this.$dateMax()]);
    this.$mailCountRangeValues.set([1, this.$mailCountMax()]);
  }

  public onDrawerClose(): void {
    this.$isDrawerOpen.set(false);
    this.$selection.set({ type: 'none' });
    this._selectedMailService.clearSelectedMail();
  }

  public onNodeHover(email: string): void {
    this.$hoveredNodeEmail.set(email);
  }

  public onNodeHoverLeave(): void {
    this.$hoveredNodeEmail.set(null);
  }
}
