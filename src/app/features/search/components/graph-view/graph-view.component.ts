import { Component, inject, signal, computed } from '@angular/core';
import { GraphDataService } from '../../../../core/services/graph-data.service';
import { MockGraphMailService } from '../../../../core/services/mock-graph-mail.service';
import { GraphSelection } from '../../types/graph-selection.type';
import { GraphNode } from '../../types/graph-node.type';
import { MailUserInfo } from '../../../../shared/types/mail-user-info.type';
import { GraphCanvasComponent } from '../../organisms/graph-canvas/graph-canvas.component';
import { GraphDrawerComponent } from '../../organisms/graph-drawer/graph-drawer.component';
import { NodePanelComponent } from '../../molecules/node-panel/node-panel.component';

@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [GraphCanvasComponent, GraphDrawerComponent, NodePanelComponent],
  templateUrl: './graph-view.component.html',
  styleUrl: './graph-view.component.scss'
})
export class GraphViewComponent {
  private _graphDataService = inject(GraphDataService);
  private _mockGraphMailService = inject(MockGraphMailService);

  readonly $graphData = this._graphDataService.$graphData;

  $selection = signal<GraphSelection>({ type: 'none' });
  $isDrawerOpen = signal(false);

  $dateMin = computed(() => {
    const mails = this._mockGraphMailService.mails();
    if (mails.length === 0) {
      return 0;
    }
    return Math.min(...mails.map((m) => new Date(m.sent).getTime()));
  });

  $dateMax = computed(() => {
    const mails = this._mockGraphMailService.mails();
    if (mails.length === 0) {
      return 0;
    }
    return Math.max(...mails.map((m) => new Date(m.sent).getTime()));
  });

  $dateRangeValues = signal<number[]>([0, 0]);

  $mailCountRangeValues = signal<number[]>([1, 1]);

  $dateFilteredMails = computed(() => {
    const mails = this._mockGraphMailService.mails();
    const [min, max] = this.$dateRangeValues();
    return mails.filter((m) => {
      const t = new Date(m.sent).getTime();
      return t >= min && t <= max;
    });
  });

  $filteredNodeCounts = computed(() => {
    const mails = this.$dateFilteredMails();
    const counts = new Map<string, number>();

    mails.forEach((mail) => {
      const fromEmail = mail.from.mail ?? '';
      if (fromEmail) {
        counts.set(fromEmail, (counts.get(fromEmail) ?? 0) + 1);
      }

      const recipients: MailUserInfo[] = [...mail.to, ...(mail.cc ?? []), ...(mail.bcc ?? [])];
      recipients.forEach((r) => {
        const email = r.mail ?? '';
        if (email) {
          counts.set(email, (counts.get(email) ?? 0) + 1);
        }
      });
    });

    return counts;
  });

  $mailCountMax = computed(() => {
    const counts = this.$filteredNodeCounts();
    if (counts.size === 0) {
      return 1;
    }
    return Math.max(...Array.from(counts.values()));
  });

  $visibleNodeEmails = computed(() => {
    const counts = this.$filteredNodeCounts();
    const [min, max] = this.$mailCountRangeValues();
    const visible = new Set<string>();

    counts.forEach((count, email) => {
      if (count >= min && count <= max) {
        visible.add(email);
      }
    });

    return visible;
  });

  $nodeList = computed<GraphNode[]>(() => {
    const allNodes = this.$graphData().nodes;
    const counts = this.$filteredNodeCounts();
    const [min, max] = this.$mailCountRangeValues();

    return Array.from(allNodes.values())
      .filter((node) => {
        const count = counts.get(node.email) ?? 0;
        return count >= min && count <= max;
      })
      .map((node) => ({
        ...node,
        mailCount: counts.get(node.email) ?? 0
      }));
  });

  $selectedNodeEmail = computed<string | null>(() => {
    const sel = this.$selection();
    if (sel.type === 'node') {
      return sel.nodeEmail ?? null;
    }
    return null;
  });

  $filteredMails = computed(() => {
    const sel = this.$selection();
    if (sel.type === 'node' && sel.nodeEmail) {
      return this._graphDataService.getMailsForNode(sel.nodeEmail);
    }
    if (sel.type === 'edge' && sel.edgeSourceEmail && sel.edgeTargetEmail) {
      return this._graphDataService.getMailsForEdge(sel.edgeSourceEmail, sel.edgeTargetEmail);
    }
    return [];
  });

  constructor() {
    const dateMin = this.$dateMin();
    const dateMax = this.$dateMax();
    this.$dateRangeValues.set([dateMin, dateMax]);

    const mailCountMax = this.$mailCountMax();
    this.$mailCountRangeValues.set([1, mailCountMax]);
  }

  public onNodeClick(email: string): void {
    const current = this.$selection();
    if (current.type === 'node' && current.nodeEmail === email) {
      this.$selection.set({ type: 'none' });
      this.$isDrawerOpen.set(false);
      return;
    }
    this.$selection.set({ type: 'node', nodeEmail: email });
    this.$isDrawerOpen.set(true);
  }

  public onEdgeClick(event: { source: string; target: string }): void {
    this.$selection.set({
      type: 'edge',
      edgeSourceEmail: event.source,
      edgeTargetEmail: event.target
    });
    this.$isDrawerOpen.set(true);
  }

  public onStageClick(): void {
    this.$selection.set({ type: 'none' });
    this.$isDrawerOpen.set(false);
  }

  public onDateRangeChange(values: number[]): void {
    this.$dateRangeValues.set(values);
  }

  public onMailCountRangeChange(values: number[]): void {
    this.$mailCountRangeValues.set(values);
  }

  public onDrawerClose(): void {
    this.$isDrawerOpen.set(false);
    this.$selection.set({ type: 'none' });
  }
}
