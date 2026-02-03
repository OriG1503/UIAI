import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DropdownOption } from '../../types/dropdown-option.type';
import { COMMON_TRANSLATIONS } from '../../../../shared/translations/common.translations';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [FormsModule, Select],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
})
export class FilterDropdownComponent {
  $value = input<string | null>(null, { alias: 'value' });
  valueChange = output<string | null>();

  $options = input<DropdownOption[]>([], { alias: 'options' });
  $placeholder = input<string>(COMMON_TRANSLATIONS.select, { alias: 'placeholder' });

  public onValueChange(value: string | null): void {
    this.valueChange.emit(value);
  }
}
