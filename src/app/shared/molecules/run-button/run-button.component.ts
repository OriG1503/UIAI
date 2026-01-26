import { Component, output } from '@angular/core';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss',
})
export class RunButtonComponent {
  run = output<void>();

  onClick(): void {
    this.run.emit();
  }
}
