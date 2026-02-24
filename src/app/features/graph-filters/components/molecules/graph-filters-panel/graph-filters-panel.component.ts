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
import { ICON_SIZE_XS } from '../../../../../shared/consts/icon-size.consts';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../../../shared/pipes/format-time.pipe';

@Component({
  selector: 'app-graph-filters-panel',
  standalone: true,
  imports: [FormsModule, Slider, IconComponent, FormatDatePipe, FormatTimePipe],
  templateUrl: './graph-filters-panel.component.html',
  styleUrl: './graph-filters-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GraphFiltersPanelComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_XS = ICON_SIZE_XS;

  public $nodes: InputSignal<GraphNode[]> = input<GraphNode[]>([], { alias: 'nodes' });
  public $selectedEmail: InputSignal<string | null> = input<string | null>(null, { alias: 'selectedEmail' });
  public $dateMin: InputSignal<number> = input<number>(0, { alias: 'dateMin' });
  public $dateMax: InputSignal<number> = input<number>(0, { alias: 'dateMax' });
  public $dateRangeValues: InputSignal<number[]> = input<number[]>([0, 0], { alias: 'dateRangeValues' });
  public $mailCountMin: InputSignal<number> = input<number>(1, { alias: 'mailCountMin' });
  public $mailCountMax: InputSignal<number> = input<number>(1, { alias: 'mailCountMax' });
  public $mailCountRangeValues: InputSignal<number[]> = input<number[]>([1, 1], { alias: 'mailCountRangeValues' });

  public nodeClick: OutputEmitterRef<string> = output<string>();
  public nodeHover: OutputEmitterRef<string> = output<string>();
  public nodeHoverLeave: OutputEmitterRef<void> = output<void>();
  public dateRangeChange: OutputEmitterRef<number[]> = output<number[]>();
  public mailCountRangeChange: OutputEmitterRef<number[]> = output<number[]>();

  public $searchText: WritableSignal<string> = signal<string>('');
  public $sortMode: WritableSignal<NodeSortMode> = signal<NodeSortMode>('mails');
  public $sortDirection: WritableSignal<SortDirection> = signal<SortDirection>('desc');

  public readonly translations: typeof GRAPH_LABEL_MAP = GRAPH_LABEL_MAP;

  public $degreeSortIconColor: Signal<string> = computed<string>(() =>
    this.$sortMode() === 'degree' ? 'var(--color-dark-navy)' : 'var(--color-navy-gray)',
  );

  public $mailsSortIconColor: Signal<string> = computed<string>(() =>
    this.$sortMode() === 'mails' ? 'var(--color-dark-navy)' : 'var(--color-navy-gray)',
  );

  public $dateStep: Signal<number> = computed<number>(() => {
    const range: number = this.$dateMax() - this.$dateMin();
    if (range <= 0) {
      return 1;
    }
    return Math.max(1, Math.floor(range / 200));
  });

  public $filteredNodes: Signal<GraphNode[]> = computed<GraphNode[]>(() => {
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

}
