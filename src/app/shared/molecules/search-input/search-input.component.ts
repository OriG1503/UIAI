import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, InputText],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  $value = model<string>('', { alias: 'value' });
  advancedClick = output<void>();

  onAdvancedClick(): void {
    this.advancedClick.emit();
  }
}
