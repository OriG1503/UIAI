import { Component, output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { BUTTON_TRANSLATIONS } from '../../../../shared/translations/common.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-alert-button',
  standalone: true,
  imports: [Menu, IconComponent],
  templateUrl: './alert-button.component.html',
  styleUrl: './alert-button.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AlertButtonComponent {
  @ViewChild('menu') menu!: Menu;

  openIssue = output<void>();
  openRequest = output<void>();

  readonly buttonLabels = BUTTON_TRANSLATIONS;

  menuItems: MenuItem[] = [
    {
      label: this.buttonLabels.openIssue,
      command: () => this.openIssue.emit(),
    },
    {
      label: this.buttonLabels.openRequest,
      command: () => this.openRequest.emit(),
    },
  ];

  public onButtonClick(event: Event): void {
    this.menu.toggle(event);
  }
}
