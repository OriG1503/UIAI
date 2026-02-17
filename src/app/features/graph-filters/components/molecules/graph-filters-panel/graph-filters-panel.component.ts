import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  ViewEncapsulation,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { GraphNode } from '../../../../graph-canvas/types/graph-node.type';
import { NodeSortMode } from '../../../types/node-sort-mode.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { GRAPH_LABEL_MAP } from '../../../../graph-canvas/mapping/graph.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-graph-filters-panel',
  standalone: true,
  imports: [FormsModule, Slider, IconComponent],
  templateUrl: './graph-filters-panel.component.html',
  styleUrl: './graph-filters-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GraphFiltersPanelComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  $nodes: InputSignal<GraphNode[]> = input<GraphNode[]>([], { alias: 'nodes' });
  $selectedEmail: InputSignal<string | null> = input<string | null>(null, { alias: 'selectedEmail' });
  $dateMin: InputSignal<number> = input<number>(0, { alias: 'dateMin' });
  $dateMax: InputSignal<number> = input<number>(0, { alias: 'dateMax' });
  $dateRangeValues: InputSignal<number[]> = input<number[]>([0, 0], { alias: 'dateRangeValues' });
  $mailCountMin: InputSignal<number> = input<number>(1, { alias: 'mailCountMin' });
  $mailCountMax: InputSignal<number> = input<number>(1, { alias: 'mailCountMax' });
  $mailCountRangeValues: InputSignal<number[]> = input<number[]>([1, 1], { alias: 'mailCountRangeValues' });

  nodeClick: OutputEmitterRef<string> = output<string>();
  nodeHover: OutputEmitterRef<string> = output<string>();
  nodeHoverLeave: OutputEmitterRef<void> = output<void>();
  dateRangeChange: OutputEmitterRef<number[]> = output<number[]>();
  mailCountRangeChange: OutputEmitterRef<number[]> = output<number[]>();

  $searchText: WritableSignal<string> = signal<string>('');
  $sortMode: WritableSignal<NodeSortMode> = signal<NodeSortMode>('mails');
  $sortDirection: WritableSignal<SortDirection> = signal<SortDirection>('desc');

  readonly translations: typeof GRAPH_LABEL_MAP = GRAPH_LABEL_MAP;

  $dateStep: Signal<number> = computed<number>(() => {
    const range: number = this.$dateMax() - this.$dateMin();
    if (range <= 0) {
      return 1;
    }
    return Math.max(1, Math.floor(range / 200));
  });

  $filteredNodes: Signal<GraphNode[]> = computed<GraphNode[]>(() => {
    const search: string = this.$searchText().toLowerCase();
    const nodes: GraphNode[] = this.$nodes();
    const sortMode: NodeSortMode = this.$sortMode();
    const sortDirection: SortDirection = this.$sortDirection();
    const multiplier: number = sortDirection === 'desc' ? 1 : -1;
    const sorted: GraphNode[] = [...nodes].sort((a: GraphNode, b: GraphNode) => {
      if (sortMode === 'mails') {
        return (b.mailCount - a.mailCount) * multiplier;
      }
      return (b.degree - a.degree) * multiplier;
    });
    if (!search) {
      return sorted;
    }
    return sorted.filter((node: GraphNode) => node.email.toLowerCase().includes(search));
  });

  public onSearchChange(value: string): void {
    this.$searchText.set(value);
  }

  public onNodeClick(email: string): void {
    this.nodeClick.emit(email);
  }

  public onNodeHover(email: string): void {
    this.nodeHover.emit(email);
  }

  public onNodeHoverLeave(): void {
    this.nodeHoverLeave.emit();
  }

  public onDateRangeChange(values: number[]): void {
    this.dateRangeChange.emit(values);
  }

  public onMailCountRangeChange(values: number[]): void {
    this.mailCountRangeChange.emit(values);
  }

  public onSortModeChange(mode: NodeSortMode): void {
    if (this.$sortMode() === mode) {
      this.$sortDirection.set(this.$sortDirection() === 'desc' ? 'asc' : 'desc');
    } else {
      this.$sortMode.set(mode);
      this.$sortDirection.set('desc');
    }
  }

  public formatDate(timestamp: number): string {
    const date: Date = new Date(timestamp);
    const day: string = String(date.getDate()).padStart(2, '0');
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const year: string = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  public formatTime(timestamp: number): string {
    const date: Date = new Date(timestamp);
    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
