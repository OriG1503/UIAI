import { Component, model } from '@angular/core';

export type SearchModeType = 'regular' | 'agent';

@Component({
  selector: 'app-search-mode-switch',
  standalone: true,
  imports: [],
  templateUrl: './search-mode-switch.component.html',
  styleUrl: './search-mode-switch.component.scss',
})
export class SearchModeSwitchComponent {
  $mode = model<SearchModeType>('regular', { alias: 'mode' });

  onModeSelect(mode: SearchModeType): void {
    this.$mode.set(mode);
  }
}
