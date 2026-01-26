import { Component, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chips } from 'primeng/chips';

@Component({
  selector: 'app-email-chips',
  standalone: true,
  imports: [FormsModule, Chips],
  templateUrl: './email-chips.component.html',
  styleUrl: './email-chips.component.scss',
})
export class EmailChipsComponent {
  $values = model<string[]>([], { alias: 'values' });
  $placeholder = input<string>('הוסף אימייל', { alias: 'placeholder' });
}
