import { Component, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

export type DropdownOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [FormsModule, Select],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
})
export class FilterDropdownComponent {
  $value = model<string | null>(null, { alias: 'value' });
  $options = input<DropdownOption[]>([], { alias: 'options' });
  $placeholder = input<string>('בחר', { alias: 'placeholder' });
}
