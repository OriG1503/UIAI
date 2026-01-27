import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  $name = input.required<string>({ alias: 'name' });
  $size = input<string>('1rem', { alias: 'size' });
  $color = input<string>('inherit', { alias: 'color' });
}
