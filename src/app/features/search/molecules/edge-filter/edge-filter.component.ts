import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { GRAPH_TRANSLATIONS } from '../../translations/graph.translations';

@Component({
  selector: 'app-edge-filter',
  standalone: true,
  imports: [FormsModule, Slider],
  templateUrl: './edge-filter.component.html',
  styleUrl: './edge-filter.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EdgeFilterComponent {
  $min = input<number>(0, { alias: 'min' });
  $max = input<number>(100, { alias: 'max' });
  $rangeValues = input<number[]>([0, 100], { alias: 'rangeValues' });

  rangeChange = output<number[]>();

  readonly translations = GRAPH_TRANSLATIONS;

  public onRangeChange(values: number[]): void {
    this.rangeChange.emit(values);
  }
}
