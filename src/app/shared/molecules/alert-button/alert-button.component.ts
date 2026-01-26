import { Component, output, signal, ViewChild } from '@angular/core';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-alert-button',
  standalone: true,
  imports: [Menu],
  templateUrl: './alert-button.component.html',
  styleUrl: './alert-button.component.scss',
})
export class AlertButtonComponent {
  @ViewChild('menu') menu!: Menu;

  openIssue = output<void>();
  openRequest = output<void>();

  menuItems: MenuItem[] = [
    {
      label: 'לפתיחת תקלה',
      command: () => this.openIssue.emit(),
    },
    {
      label: 'לפתיחת בקשה',
      command: () => this.openRequest.emit(),
    },
  ];

  onButtonClick(event: Event): void {
    this.menu.toggle(event);
  }
}
