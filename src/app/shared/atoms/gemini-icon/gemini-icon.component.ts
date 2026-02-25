import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-gemini-icon',
  standalone: true,
  templateUrl: './gemini-icon.component.html',
  styleUrl: './gemini-icon.component.scss',
})
export class GeminiIconComponent {
  public $size: InputSignal<string> = input<string>('0.75rem', { alias: 'size' });
}
