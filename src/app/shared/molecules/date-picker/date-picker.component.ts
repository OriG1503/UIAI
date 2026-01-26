import { Component, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  $value = model<Date | null>(null, { alias: 'value' });
  $placeholder = input<string>('בחר תאריך', { alias: 'placeholder' });
}
