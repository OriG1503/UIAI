import { Component, input, output, computed, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DATE_RANGE_TRANSLATIONS } from '../../../translations/date-range.translations';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CalendarViewComponent {
  $dateRange = input<Date[] | null>(null, { alias: 'dateRange' });
  dateSelect = output<Date[]>();

  readonly translations = DATE_RANGE_TRANSLATIONS;

  $fromDate = computed(() => {
    const dateRange = this.$dateRange();
    if (dateRange && dateRange.length >= 1 && dateRange[0]) {
      return this._formatDate(dateRange[0]);
    }
    return null;
  });

  $toDate = computed(() => {
    const dateRange = this.$dateRange();
    if (dateRange && dateRange.length >= 2 && dateRange[1]) {
      return this._formatDate(dateRange[1]);
    }
    return null;
  });

  public onCalendarSelect(dates: Date[]): void {
    this.dateSelect.emit(dates);
  }

  private _formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }
}
