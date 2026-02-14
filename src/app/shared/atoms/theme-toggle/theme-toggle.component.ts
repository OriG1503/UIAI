import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { ICON_NAMES } from '../../constants/icon-name.constants';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  readonly ICON_NAMES = ICON_NAMES;

  constructor(public themeService: ThemeService) {}
}
