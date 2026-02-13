import { Component, input, output, OutputEmitterRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { SEARCH_TRANSLATIONS } from '../../../mapping/search.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, InputText, IconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  readonly ICON_NAMES = ICON_NAMES;

  $value = input<string>('', { alias: 'value' });
  valueChange: OutputEmitterRef<string> = output<string>();
  advancedClick: OutputEmitterRef<void> = output<void>();

  readonly translations = SEARCH_TRANSLATIONS;

  public onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  public onAdvancedClick(): void {
    this.advancedClick.emit();
  }
}
