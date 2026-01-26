import { Component, output } from '@angular/core';

@Component({
  selector: 'app-alert-button',
  standalone: true,
  imports: [],
  templateUrl: './alert-button.component.html',
  styleUrl: './alert-button.component.scss',
})
export class AlertButtonComponent {
  click = output<void>();

  onClick(): void {
    this.click.emit();
  }
}
