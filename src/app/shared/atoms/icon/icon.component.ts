import { Component, input } from '@angular/core';
import { IconName } from '../../constants/icon-name.constants';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  $name = input.required<IconName>({ alias: 'name' });
  $size = input<string>('1rem', { alias: 'size' });
  $color = input<string>('currentColor', { alias: 'color' });
}
