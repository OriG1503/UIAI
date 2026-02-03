import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { SEARCH_TRANSLATIONS } from '../../translations/search.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, InputText, IconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  $value = input<string>('', { alias: 'value' });
  valueChange = output<string>();
  advancedClick = output<void>();

  readonly translations = SEARCH_TRANSLATIONS;

  public onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  public onAdvancedClick(): void {
    this.advancedClick.emit();
  }
}
