import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chips } from 'primeng/chips';
import { PLACEHOLDER_TRANSLATIONS } from '../../translations';

@Component({
  selector: 'app-email-chips',
  standalone: true,
  imports: [FormsModule, Chips],
  templateUrl: './email-chips.component.html',
  styleUrl: './email-chips.component.scss',
})
export class EmailChipsComponent {
  $values = input<string[]>([], { alias: 'values' });
  valuesChange = output<string[]>();

  $placeholder = input<string>(PLACEHOLDER_TRANSLATIONS.addEmail, { alias: 'placeholder' });

  onValuesChange(values: string[]): void {
    this.valuesChange.emit(values);
  }
}
