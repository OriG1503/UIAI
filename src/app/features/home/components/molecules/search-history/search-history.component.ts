import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHistoryTab } from '../../../types/search-history-tab.type';
import { SavedSearch } from '../../../types/saved-search.type';
import { HOME_LABEL_MAP } from '../../../mapping/home.label-map';
import { MOCK_SAVED_SEARCHES } from '../../../constants/saved-search.constants';

@Component({
  selector: 'app-search-history',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss'
})
export class SearchHistoryComponent {
  $activeTab = signal<SearchHistoryTab>('saved-search');
  $nameFilter = signal<string>('');
  $option2Filter = signal<string>('');

  readonly labels = HOME_LABEL_MAP;
  readonly savedSearches: SavedSearch[] = MOCK_SAVED_SEARCHES;

  $filteredSavedSearches = computed<SavedSearch[]>(() => {
    const nameFilter: string = this.$nameFilter().trim().toLowerCase();
    const option2Filter: string = this.$option2Filter().trim().toLowerCase();

    return this.savedSearches.filter((search: SavedSearch) => {
      const isNameMatch: boolean = nameFilter === '' || search.name.toLowerCase().includes(nameFilter);
      const isOption2Match: boolean = option2Filter === '';
      return isNameMatch && isOption2Match;
    });
  });

  public onTabClick(tab: SearchHistoryTab): void {
    this.$activeTab.set(tab);
  }

  public onNameFilterChange(value: string): void {
    this.$nameFilter.set(value);
  }

  public onOption2FilterChange(value: string): void {
    this.$option2Filter.set(value);
  }
}
