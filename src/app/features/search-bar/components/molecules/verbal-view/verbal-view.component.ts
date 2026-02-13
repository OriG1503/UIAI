import { Component, output, OutputEmitterRef, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { TimeUnit, TimeUnitOption } from '../../../types/time-unit.type';
import { VerbalChange } from '../../../types/verbal-change.type';
import { DEFAULT_VERBAL_AMOUNT, DEFAULT_VERBAL_UNIT, MAX_VERBAL_DATE_AMOUNT, MIN_VERBAL_DATE_AMOUNT } from '../../../constants/date-range.constants';
import { TIME_UNIT_LABELS, DATE_RANGE_TRANSLATIONS } from '../../../mapping/date-range.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-verbal-view',
  standalone: true,
  imports: [FormsModule, Select, IconComponent],
  templateUrl: './verbal-view.component.html',
  styleUrl: './verbal-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class VerbalViewComponent {
  readonly ICON_NAMES = ICON_NAMES;

  verbalChange: OutputEmitterRef<VerbalChange> = output<VerbalChange>();

  $verbalAmount = signal(DEFAULT_VERBAL_AMOUNT);
  $verbalUnit = signal<TimeUnit>(DEFAULT_VERBAL_UNIT);

  readonly timeUnitOptions: TimeUnitOption[] = [
    { value: 'days', label: TIME_UNIT_LABELS.days },
    { value: 'weeks', label: TIME_UNIT_LABELS.weeks },
    { value: 'months', label: TIME_UNIT_LABELS.months },
    { value: 'years', label: TIME_UNIT_LABELS.years }
  ];

  readonly translations = DATE_RANGE_TRANSLATIONS;
  readonly maxAmount = MAX_VERBAL_DATE_AMOUNT;

  public decrementAmount(): void {
    const current = this.$verbalAmount();
    if (current > MIN_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current - 1);
      this._emitChange();
    }
  }

  public incrementAmount(): void {
    const current = this.$verbalAmount();
    if (current < MAX_VERBAL_DATE_AMOUNT) {
      this.$verbalAmount.set(current + 1);
      this._emitChange();
    }
  }

  public onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = parseInt(input.value, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(MIN_VERBAL_DATE_AMOUNT, Math.min(MAX_VERBAL_DATE_AMOUNT, parsed));
      this.$verbalAmount.set(clamped);
      this._emitChange();
    }
  }

  public onUnitChange(unit: TimeUnit): void {
    this.$verbalUnit.set(unit);
    this._emitChange();
  }

  private _emitChange(): void {
    this.verbalChange.emit({
      amount: this.$verbalAmount(),
      unit: this.$verbalUnit()
    });
  }
}
