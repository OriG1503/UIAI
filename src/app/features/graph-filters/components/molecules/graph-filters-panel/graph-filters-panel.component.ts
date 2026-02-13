import { Component, input, output, signal, computed, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { GraphNode } from '../../../../graph-canvas/types/graph-node.type';
import { NodeSortMode } from '../../../types/node-sort-mode.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { GRAPH_TRANSLATIONS } from '../../../../graph-canvas/translations/graph.translations';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-graph-filters-panel',
  standalone: true,
  imports: [FormsModule, Slider, IconComponent],
  templateUrl: './graph-filters-panel.component.html',
  styleUrl: './graph-filters-panel.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GraphFiltersPanelComponent {
  readonly ICON_NAMES = ICON_NAMES;

  $nodes = input<GraphNode[]>([], { alias: 'nodes' });
  $selectedEmail = input<string | null>(null, { alias: 'selectedEmail' });
  $dateMin = input<number>(0, { alias: 'dateMin' });
  $dateMax = input<number>(0, { alias: 'dateMax' });
  $dateRangeValues = input<number[]>([0, 0], { alias: 'dateRangeValues' });
  $mailCountMin = input<number>(1, { alias: 'mailCountMin' });
  $mailCountMax = input<number>(1, { alias: 'mailCountMax' });
  $mailCountRangeValues = input<number[]>([1, 1], { alias: 'mailCountRangeValues' });

  nodeClick = output<string>();
  nodeHover = output<string>();
  nodeHoverLeave = output<void>();
  dateRangeChange = output<number[]>();
  mailCountRangeChange = output<number[]>();

  $searchText = signal('');
  $sortMode = signal<NodeSortMode>('mails');
  $sortDirection = signal<SortDirection>('desc');

  readonly translations = GRAPH_TRANSLATIONS;

  $dateStep = computed(() => {
    const range = this.$dateMax() - this.$dateMin();
    if (range <= 0) {
      return 1;
    }
    return Math.max(1, Math.floor(range / 200));
  });

  $filteredNodes = computed(() => {
    const search = this.$searchText().toLowerCase();
    const nodes = this.$nodes();
    const sortMode = this.$sortMode();
    const sortDirection = this.$sortDirection();
    const multiplier = sortDirection === 'desc' ? 1 : -1;
    const sorted = [...nodes].sort((a, b) => {
      if (sortMode === 'mails') {
        return (b.mailCount - a.mailCount) * multiplier;
      }
      return (b.degree - a.degree) * multiplier;
    });
    if (!search) {
      return sorted;
    }
    return sorted.filter((node) => node.email.toLowerCase().includes(search));
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
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  public formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
