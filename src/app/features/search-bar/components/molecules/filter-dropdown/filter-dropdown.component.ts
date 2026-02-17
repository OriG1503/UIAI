import { Component, input, output, OutputEmitterRef, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DropdownOption } from '../../../types/dropdown-option.type';
import { COMMON_LABEL_MAP } from '../../../../../shared/mapping/common.label-map';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [FormsModule, Select],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
})
export class FilterDropdownComponent {
  $value: InputSignal<string | null> = input<string | null>(null, { alias: 'value' });
  valueChange: OutputEmitterRef<string | null> = output<string | null>();

  $options: InputSignal<DropdownOption[]> = input<DropdownOption[]>([], { alias: 'options' });
  $placeholder: InputSignal<string> = input<string>(COMMON_LABEL_MAP.select, { alias: 'placeholder' });

  public onValueChange(value: string | null): void {
    this.valueChange.emit(value);
  }
}
