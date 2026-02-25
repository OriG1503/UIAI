import { Component, input, output, OutputEmitterRef, InputSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { SEARCH_LABEL_MAP } from '../../../mapping/search.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { SearchModeType } from '../../../types/search-mode-type.type';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, InputText, IconComponent],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  public $value: InputSignal<string> = input<string>('', { alias: 'value' });
  public $searchMode: InputSignal<SearchModeType> = input<SearchModeType>('regular', { alias: 'searchMode' });
  public valueChange: OutputEmitterRef<string> = output<string>();
  public advancedClick: OutputEmitterRef<void> = output<void>();

  public readonly translations: typeof SEARCH_LABEL_MAP = SEARCH_LABEL_MAP;

  public onValueChange(value: string): void {
    this.valueChange.emit(value);
  }

  public onAdvancedClick(): void {
    this.advancedClick.emit();
  }
}
