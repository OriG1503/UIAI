import { Component, input, output, signal, computed, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { DateRangeMode } from '../../types/date-range-mode.type';
import { DateFilterOption } from '../../types/date-filter-option.type';
import { TimeUnit, TimeUnitOption } from '../../types/time-unit.type';
import { MAX_VERBAL_DATE_AMOUNT, MIN_VERBAL_DATE_AMOUNT } from '../../constants/date-range.constants';
import {
  DATE_RANGE_MODE_LABELS,
  DATE_FILTER_OPTION_LABELS,
  TIME_UNIT_LABELS,
  DATE_RANGE_TRANSLATIONS
} from '../../translations/date-range.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [FormsModule, DatePicker, Select, IconComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DateRangePickerComponent {
  $dateRange = input<Date[] | null>(null, { alias: 'dateRange' });
  dateRangeChange = output<Date[] | null>();

  $isPopupOpen = signal(false);
  $selectedMode = signal<DateRangeMode>('calendar');
  $selectedOption = signal<DateFilterOption>('option1');
  $lastSelectionMode = signal<DateRangeMode>('calendar');
  $verbalAmount = signal(2);
  $verbalUnit = signal<TimeUnit>('weeks');

  readonly timeUnitOptions: TimeUnitOption[] = [
    { value: 'days', label: TIME_UNIT_LABELS.days },
    { value: 'weeks', label: TIME_UNIT_LABELS.weeks },
    { value: 'months', label: TIME_UNIT_LABELS.months },
    { value: 'years', label: TIME_UNIT_LABELS.years }
  ];

  readonly modeLabels = DATE_RANGE_MODE_LABELS;
  readonly optionLabels = DATE_FILTER_OPTION_LABELS;
  readonly translations = DATE_RANGE_TRANSLATIONS;
  readonly maxAmount = MAX_VERBAL_DATE_AMOUNT;

  constructor(private _elementRef: ElementRef) {}

  $buttonLabel = computed(() => {
    const isOpen = this.$isPopupOpen();
    const dateRange = this.$dateRange();
    const hasDates = !!dateRange && dateRange.length === 2 && !!dateRange[0] && !!dateRange[1];

    if (isOpen || !hasDates) {
      return this.translations.defaultLabel;
    }

    if (this.$lastSelectionMode() === 'verbal') {
      const amount = this.$verbalAmount();
      const unit = this.$verbalUnit();
      const unitLabel = this.timeUnitOptions.find((o) => o.value === unit)?.label ?? '';
      return `${amount} ${unitLabel}`;
    }

    return `${this._formatDate(dateRange[0]!)} - ${this._formatDate(dateRange[1]!)}`;
  });

  $isButtonLabelLtr = computed(() => {
    return this.$isActive() && this.$lastSelectionMode() === 'calendar';
  });

  $isActive = computed(() => {
    const dateRange = this.$dateRange();
    return !this.$isPopupOpen() && !!dateRange && dateRange.length === 2 && !!dateRange[0] && !!dateRange[1];
  });

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

  private _formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() % 100).toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.$isPopupOpen.set(false);
    }
  }

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
  }

  public selectMode(mode: DateRangeMode): void {
    this.$selectedMode.set(mode);
    if (mode === 'verbal') {
      this._emitVerbalRange();
    }
  }

  public selectOption(option: DateFilterOption): void {
    this.$selectedOption.set(option);
  }

  public onCalendarSelect(dates: Date[]): void {
    this.$lastSelectionMode.set('calendar');
    this.dateRangeChange.emit(dates);
  }

  public decrementAmount(): void {
    const current = this.$verbalAmount();
    if (current > MIN_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current - 1);
      this._emitVerbalIfActive();
    }
  }

  public incrementAmount(): void {
    const current = this.$verbalAmount();
    if (current < MAX_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current + 1);
      this._emitVerbalIfActive();
    }
  }

  public onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = parseInt(input.value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(MIN_VERBAL_DATE_AMOUNT, Math.min(MAX_VERBAL_DATE_AMOUNT, parsed));
      this.$verbalAmount.set(clamped);
      this._emitVerbalIfActive();
    }
  }

  public onUnitChange(unit: TimeUnit): void {
    this.$verbalUnit.set(unit);
    this._emitVerbalIfActive();
  }

  private _emitVerbalIfActive(): void {
    if (this.$selectedMode() === 'verbal') {
      this._emitVerbalRange();
    }
  }

  private _emitVerbalRange(): void {
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

    this.$lastSelectionMode.set('verbal');
    this.dateRangeChange.emit([startDate, today]);
  }
}
