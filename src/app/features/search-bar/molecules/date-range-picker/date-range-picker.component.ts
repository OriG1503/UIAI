import { Component, input, output, signal, computed, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { DateRangeMode } from '../../types/date-range-mode.type';
import { DateFilterOption } from '../../types/date-filter-option.type';
import { TimeUnit, TimeUnitOption } from '../../types/time-unit.type';
import { VerbalChange } from '../../types/verbal-change.type';
import {
  DATE_RANGE_MODE_LABELS,
  DATE_FILTER_OPTION_LABELS,
  TIME_UNIT_LABELS,
  DATE_RANGE_TRANSLATIONS
} from '../../translations/date-range.translations';
import { DEFAULT_VERBAL_AMOUNT, DEFAULT_VERBAL_UNIT } from '../../constants/date-range.constants';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../shared/constants/icon-name.constants';
import { CalendarViewComponent } from '../calendar-view/calendar-view.component';
import { VerbalViewComponent } from '../verbal-view/verbal-view.component';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [IconComponent, CalendarViewComponent, VerbalViewComponent],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DateRangePickerComponent {
  readonly ICON_NAMES = ICON_NAMES;
  $dateRange = input<Date[] | null>(null, { alias: 'dateRange' });
  dateRangeChange = output<Date[] | null>();

  $isPopupOpen = signal(false);
  $selectedMode = signal<DateRangeMode>('calendar');
  $selectedOption = signal<DateFilterOption>('option1');
  $lastSelectionMode = signal<DateRangeMode>('calendar');
  private _$verbalAmount = signal(DEFAULT_VERBAL_AMOUNT);
  private _$verbalUnit = signal<TimeUnit>(DEFAULT_VERBAL_UNIT);

  readonly timeUnitOptions: TimeUnitOption[] = [
    { value: 'days', label: TIME_UNIT_LABELS.days },
    { value: 'weeks', label: TIME_UNIT_LABELS.weeks },
    { value: 'months', label: TIME_UNIT_LABELS.months },
    { value: 'years', label: TIME_UNIT_LABELS.years }
  ];

  readonly modeLabels = DATE_RANGE_MODE_LABELS;
  readonly optionLabels = DATE_FILTER_OPTION_LABELS;
  readonly translations = DATE_RANGE_TRANSLATIONS;

  constructor(private _elementRef: ElementRef) {}

  $buttonLabel = computed(() => {
    const isOpen = this.$isPopupOpen();
    const dateRange = this.$dateRange();
    const hasDates = !!dateRange && dateRange.length === 2 && !!dateRange[0] && !!dateRange[1];

    if (isOpen || !hasDates) {
      return this.translations.defaultLabel;
    }

    if (this.$lastSelectionMode() === 'verbal') {
      const amount = this._$verbalAmount();
      const unit = this._$verbalUnit();
      const unitLabel = this.timeUnitOptions.find((o) => o.value === unit)?.label ?? '';
      return `${amount} ${unitLabel}`;
    }

    return `${this._formatDate(dateRange[0]!)} - ${this._formatDate(dateRange[1]!)}`;
  });

  $isActive = computed(() => {
    const dateRange = this.$dateRange();
    return !this.$isPopupOpen() && !!dateRange && dateRange.length === 2 && !!dateRange[0] && !!dateRange[1];
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
      this._emitVerbalRange(this._$verbalAmount(), this._$verbalUnit());
    }
  }

  public selectOption(option: DateFilterOption): void {
    this.$selectedOption.set(option);
  }

  public onCalendarSelect(dates: Date[]): void {
    this.$lastSelectionMode.set('calendar');
    this.dateRangeChange.emit(dates);
  }

  public onVerbalChange(change: VerbalChange): void {
    this._$verbalAmount.set(change.amount);
    this._$verbalUnit.set(change.unit);
    this._emitVerbalRange(change.amount, change.unit);
  }

  private _emitVerbalRange(amount: number, unit: TimeUnit): void {
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
