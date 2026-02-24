import { Component } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { ThemeService } from '../../../core/services/theme.service';
import { ICON_NAMES } from '../../consts/icon-name.consts';
import { COMMON_LABEL_MAP } from '../../mapping/common.label-map';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly translations: typeof COMMON_LABEL_MAP = COMMON_LABEL_MAP;

  constructor(public themeService: ThemeService) {}
}
