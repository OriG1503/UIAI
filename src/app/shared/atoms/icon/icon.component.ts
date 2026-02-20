import { Component, input, InputSignal } from '@angular/core';
import { IconName } from '../../consts/icon-name.consts';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  $name: InputSignal<IconName> = input.required<IconName>({ alias: 'name' });
  $size: InputSignal<string> = input<string>('1rem', { alias: 'size' });
  $color: InputSignal<string> = input<string>('var(--color-dark-navy)', { alias: 'color' });
}
