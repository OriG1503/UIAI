import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [FormsModule, DatePicker],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
})
export class DateRangePickerComponent {
  $dateRange = model<Date[] | null>(null, { alias: 'dateRange' });
}
