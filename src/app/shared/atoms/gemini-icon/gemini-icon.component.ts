import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gemini-icon',
  standalone: true,
  templateUrl: './gemini-icon.component.html',
  styleUrl: './gemini-icon.component.scss'
})
export class GeminiIconComponent {
  $size = input<string>('0.75rem', { alias: 'size' });
}
