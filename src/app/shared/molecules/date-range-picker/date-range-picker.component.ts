import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { DateRangeMode, TimeUnit, TimeUnitOption } from '../../types';
import { MAX_VERBAL_DATE_AMOUNT, MIN_VERBAL_DATE_AMOUNT } from '../../constants';
import { DATE_RANGE_MODE_LABELS, TIME_UNIT_LABELS, DATE_RANGE_TRANSLATIONS } from '../../translations';
import { IconComponent } from '../../atoms';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [FormsModule, DatePicker, Select, IconComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
})
export class DateRangePickerComponent {
  $dateRange = input<Date[] | null>(null, { alias: 'dateRange' });
  dateRangeChange = output<Date[] | null>();

  $isPopupOpen = signal(false);
  $selectedMode = signal<DateRangeMode | null>(null);
  $verbalAmount = signal(MIN_VERBAL_DATE_AMOUNT);
  $verbalUnit = signal<TimeUnit>('weeks');

  readonly timeUnitOptions: TimeUnitOption[] = [
    { value: 'days', label: TIME_UNIT_LABELS.days },
    { value: 'weeks', label: TIME_UNIT_LABELS.weeks },
    { value: 'months', label: TIME_UNIT_LABELS.months },
    { value: 'years', label: TIME_UNIT_LABELS.years },
  ];

  readonly modeLabels = DATE_RANGE_MODE_LABELS;
  readonly translations = DATE_RANGE_TRANSLATIONS;
  readonly maxAmount = MAX_VERBAL_DATE_AMOUNT;

  $displayText = computed(() => {
    const dateRange = this.$dateRange();
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const start = this._formatDate(dateRange[0]);
      const end = this._formatDate(dateRange[1]);
      return `${start} - ${end}`;
    }
    return this.translations.selectDateRange;
  });

  private _formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
    if (!this.$isPopupOpen()) {
      this.$selectedMode.set(null);
    }
  }

  closePopup(): void {
    this.$isPopupOpen.set(false);
    this.$selectedMode.set(null);
  }

  selectMode(mode: DateRangeMode): void {
    this.$selectedMode.set(mode);
  }

  goBackToModeSelection(): void {
    this.$selectedMode.set(null);
  }

  onCalendarSelect(dates: Date[]): void {
    this.dateRangeChange.emit(dates);
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      this.closePopup();
    }
  }

  decrementAmount(): void {
    const current = this.$verbalAmount();
    if (current > MIN_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current - 1);
    }
  }

  incrementAmount(): void {
    const current = this.$verbalAmount();
    if (current < MAX_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current + 1);
    }
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = parseInt(input.value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(MIN_VERBAL_DATE_AMOUNT, Math.min(MAX_VERBAL_DATE_AMOUNT, parsed));
      this.$verbalAmount.set(clamped);
    }
  }

  applyVerbalRange(): void {
    const amount = this.$verbalAmount();
    const unit = this.$verbalUnit();
    const today = new Date();
    const startDate = new Date();

    switch (unit) {
      case 'days':
        startDate.setDate(today.getDate() - amount);
        break;
      case 'weeks':
        startDate.setDate(today.getDate() - amount * 7);
        break;
      case 'months':
        startDate.setMonth(today.getMonth() - amount);
        break;
      case 'years':
        startDate.setFullYear(today.getFullYear() - amount);
        break;
    }

    this.dateRangeChange.emit([startDate, today]);
    this.closePopup();
  }
}
