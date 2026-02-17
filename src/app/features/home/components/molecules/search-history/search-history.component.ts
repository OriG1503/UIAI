import { Component, input, signal } from '@angular/core';
import { SearchHistoryTab } from '../../../types/search-history-tab.type';
import { SavedSearch } from '../../../types/saved-search.type';
import { LastSearch } from '../../../types/last-search.type';
import { HOME_LABEL_MAP } from '../../../mapping/home.label-map';
import { SavedSearchListComponent } from '../saved-search-list/saved-search-list.component';
import { LastSearchListComponent } from '../last-search-list/last-search-list.component';

@Component({
  selector: 'app-search-history',
  standalone: true,
  imports: [SavedSearchListComponent, LastSearchListComponent],
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss'
})
export class SearchHistoryComponent {
  readonly labels = HOME_LABEL_MAP;

  $savedSearches = input.required<SavedSearch[]>({ alias: 'savedSearches' });
  $lastSearches = input.required<LastSearch[]>({ alias: 'lastSearches' });

  $activeTab = signal<SearchHistoryTab>('saved-search');

  public onTabClick(tab: SearchHistoryTab): void {
    this.$activeTab.set(tab);
  }
}
