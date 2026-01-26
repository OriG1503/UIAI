import { Component, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

export type TagOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-tag-filter-dropdown',
  standalone: true,
  imports: [FormsModule, Select],
  templateUrl: './tag-filter-dropdown.component.html',
  styleUrl: './tag-filter-dropdown.component.scss',
})
export class TagFilterDropdownComponent {
  $value = model<string | null>(null, { alias: 'value' });
  $options = input<TagOption[]>([], { alias: 'options' });
  $placeholder = input<string>('בחר תגית', { alias: 'placeholder' });
}
