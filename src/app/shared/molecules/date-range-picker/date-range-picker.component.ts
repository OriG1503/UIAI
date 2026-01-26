import { Component, model, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { DateRangeMode } from './date-range-mode.type';
import { TimeUnit, TimeUnitOption } from './time-unit.type';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [FormsModule, DatePicker, Select],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
})
export class DateRangePickerComponent {
  $dateRange = model<Date[] | null>(null, { alias: 'dateRange' });

  $isPopupOpen = signal(false);
  $selectedMode = signal<DateRangeMode | null>(null);
  $verbalAmount = signal(1);
  $verbalUnit = signal<TimeUnit>('weeks');

  readonly timeUnitOptions: TimeUnitOption[] = [
    { value: 'days', label: 'ימים' },
    { value: 'weeks', label: 'שבועות' },
    { value: 'months', label: 'חודשים' },
    { value: 'years', label: 'שנים' },
  ];

  $displayText = computed(() => {
    const dateRange = this.$dateRange();
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const start = this._formatDate(dateRange[0]);
      const end = this._formatDate(dateRange[1]);
      return `${start} - ${end}`;
    }
    return 'בחר טווח תאריכים';
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

  onCalendarSelect(): void {
    const range = this.$dateRange();
    if (range && range.length === 2 && range[0] && range[1]) {
      this.closePopup();
    }
  }

  decrementAmount(): void {
    const current = this.$verbalAmount();
    if (current > 1) {
      this.$verbalAmount.set(current - 1);
    }
  }

  incrementAmount(): void {
    const current = this.$verbalAmount();
    if (current < 12) {
      this.$verbalAmount.set(current + 1);
    }
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = parseInt(input.value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(12, parsed));
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

    this.$dateRange.set([startDate, today]);
    this.closePopup();
  }
}
