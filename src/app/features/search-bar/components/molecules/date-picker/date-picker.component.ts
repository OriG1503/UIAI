import { Component, input, output, OutputEmitterRef, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { PLACEHOLDER_LABEL_MAP } from '../../../../../shared/mapping/common.label-map';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  $value: InputSignal<Date | null> = input<Date | null>(null, { alias: 'value' });
  valueChange: OutputEmitterRef<Date | null> = output<Date | null>();

  $placeholder: InputSignal<string> = input<string>(PLACEHOLDER_LABEL_MAP.selectDate, { alias: 'placeholder' });

  public onValueChange(value: Date | null): void {
    this.valueChange.emit(value);
  }
}
