import { Component, input, output, OutputEmitterRef, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chips } from 'primeng/chips';
import { PLACEHOLDER_LABEL_MAP } from '../../../../../shared/mapping/common.label-map';

@Component({
  selector: 'app-email-chips',
  standalone: true,
  imports: [FormsModule, Chips],
  templateUrl: './email-chips.component.html',
  styleUrl: './email-chips.component.scss',
})
export class EmailChipsComponent {
  $values: InputSignal<string[]> = input<string[]>([], { alias: 'values' });
  valuesChange: OutputEmitterRef<string[]> = output<string[]>();

  $placeholder: InputSignal<string> = input<string>(PLACEHOLDER_LABEL_MAP.addEmail, { alias: 'placeholder' });

  public onValuesChange(values: string[]): void {
    this.valuesChange.emit(values);
  }
}
