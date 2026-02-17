import { Component, signal } from '@angular/core';
import { SearchHistoryTab } from '../../../types/search-history-tab.type';
import { HOME_LABEL_MAP } from '../../../mapping/home.label-map';

@Component({
  selector: 'app-search-history',
  standalone: true,
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss'
})
export class SearchHistoryComponent {
  $activeTab = signal<SearchHistoryTab>('saved');

  readonly labels = HOME_LABEL_MAP;

  public onTabClick(tab: SearchHistoryTab): void {
    this.$activeTab.set(tab);
  }
}
