import { Component, input, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chips } from 'primeng/chips';
import { PLACEHOLDER_TRANSLATIONS } from '../../../../../shared/translations/common.translations';

@Component({
  selector: 'app-email-chips',
  standalone: true,
  imports: [FormsModule, Chips],
  templateUrl: './email-chips.component.html',
  styleUrl: './email-chips.component.scss',
})
export class EmailChipsComponent {
  $values = input<string[]>([], { alias: 'values' });
  valuesChange: OutputEmitterRef<string[]> = output<string[]>();

  $placeholder = input<string>(PLACEHOLDER_TRANSLATIONS.addEmail, { alias: 'placeholder' });

  public onValuesChange(values: string[]): void {
    this.valuesChange.emit(values);
  }
}
