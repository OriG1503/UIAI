import {
  Component,
  input,
  output,
  OutputEmitterRef,
  computed,
  ViewEncapsulation,
  InputSignal,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DATE_RANGE_LABEL_MAP } from '../../../mapping/date-range.label-map';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarViewComponent {
  $dateRange: InputSignal<Date[] | null> = input<Date[] | null>(null, { alias: 'dateRange' });
  dateSelect: OutputEmitterRef<Date[]> = output<Date[]>();

  readonly translations: typeof DATE_RANGE_LABEL_MAP = DATE_RANGE_LABEL_MAP;

  $fromDate: Signal<string | null> = computed<string | null>(() => {
    const dateRange: Date[] | null = this.$dateRange();
    if (dateRange && dateRange.length >= 1 && dateRange[0]) {
      return this._formatDate(dateRange[0]);
    }
    return null;
  });

  $toDate: Signal<string | null> = computed<string | null>(() => {
    const dateRange: Date[] | null = this.$dateRange();
    if (dateRange && dateRange.length >= 2 && dateRange[1]) {
      return this._formatDate(dateRange[1]);
    }
    return null;
  });

  public onCalendarSelect(dates: Date[]): void {
    this.dateSelect.emit(dates);
  }

  private _formatDate(date: Date): string {
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: string = (date.getFullYear() % 100).toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
}
