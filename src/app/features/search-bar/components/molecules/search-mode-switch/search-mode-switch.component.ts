import { Component, input, output, OutputEmitterRef, ViewEncapsulation, InputSignal } from '@angular/core';
import { SearchModeType } from '../../../types/search-mode-type.type';
import { SEARCH_MODE_LABEL_MAP } from '../../../mapping/search.label-map';
import { GeminiRainComponent } from '../gemini-rain/gemini-rain.component';

@Component({
  selector: 'app-search-mode-switch',
  standalone: true,
  imports: [GeminiRainComponent],
  templateUrl: './search-mode-switch.component.html',
  styleUrl: './search-mode-switch.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchModeSwitchComponent {
  public $mode: InputSignal<SearchModeType> = input<SearchModeType>('regular', { alias: 'mode' });
  public modeChange: OutputEmitterRef<SearchModeType> = output<SearchModeType>();

  public readonly labels: typeof SEARCH_MODE_LABEL_MAP = SEARCH_MODE_LABEL_MAP;

  public onModeSelect(mode: SearchModeType): void {
    this.modeChange.emit(mode);
  }
}
