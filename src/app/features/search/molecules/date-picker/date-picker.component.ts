import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { PLACEHOLDER_TRANSLATIONS } from '../../../../shared';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  $value = input<Date | null>(null, { alias: 'value' });
  valueChange = output<Date | null>();

  $placeholder = input<string>(PLACEHOLDER_TRANSLATIONS.selectDate, { alias: 'placeholder' });

  public onValueChange(value: Date | null): void {
    this.valueChange.emit(value);
  }
}
