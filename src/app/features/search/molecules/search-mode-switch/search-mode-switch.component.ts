import { Component, input, output } from '@angular/core';
import { SearchModeType } from '../../types/search-mode-type.type';
import { SEARCH_MODE_LABELS } from '../../translations/search.translations';

@Component({
  selector: 'app-search-mode-switch',
  standalone: true,
  imports: [],
  templateUrl: './search-mode-switch.component.html',
  styleUrl: './search-mode-switch.component.scss',
})
export class SearchModeSwitchComponent {
  $mode = input<SearchModeType>('regular', { alias: 'mode' });
  modeChange = output<SearchModeType>();

  readonly labels = SEARCH_MODE_LABELS;

  public onModeSelect(mode: SearchModeType): void {
    this.modeChange.emit(mode);
  }
}
