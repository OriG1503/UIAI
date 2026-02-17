import { Component, computed, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHistoryTab } from '../../../types/search-history-tab.type';
import { SavedSearch } from '../../../types/saved-search.type';
import { HOME_LABEL_MAP } from '../../../mapping/home.label-map';
import { MOCK_SAVED_SEARCHES, CURRENT_USERNAME } from '../../../constants/saved-search.constants';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-search-history',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './search-history.component.html',
  styleUrl: './search-history.component.scss'
})
export class SearchHistoryComponent {
  readonly ICON_NAMES = ICON_NAMES;

  $activeTab = signal<SearchHistoryTab>('saved-search');
  $nameFilter = signal<string>('');
  $userFilter = signal<string>('');
  $savedSearches = signal<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  $openMenuIndex = signal<number>(-1);

  readonly labels = HOME_LABEL_MAP;

  $filteredSavedSearches = computed<SavedSearch[]>(() => {
    const nameFilter: string = this.$nameFilter().trim().toLowerCase();
    const userFilter: string = this.$userFilter().trim().toLowerCase();
    const isUserFiltering: boolean = userFilter !== '';

    const filtered: SavedSearch[] = this.$savedSearches().filter((search: SavedSearch) => {
      const isNameMatch: boolean = nameFilter === '' || search.name.toLowerCase().includes(nameFilter);
      const isUserMatch: boolean = isUserFiltering
        ? search.username.toLowerCase().includes(userFilter)
        : search.username === CURRENT_USERNAME;
      return isNameMatch && isUserMatch;
    });

    return [...filtered].sort((a: SavedSearch, b: SavedSearch) => {
      if (a.isPinned && !b.isPinned) {
        return -1;
      }
      if (!a.isPinned && b.isPinned) {
        return 1;
      }
      return b.date.getTime() - a.date.getTime();
    });
  });

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('.dots-btn') && !target.closest('.actions-slider')) {
      this.$openMenuIndex.set(-1);
    }
  }

  public onTabClick(tab: SearchHistoryTab): void {
    this.$activeTab.set(tab);
  }

  public onNameFilterChange(value: string): void {
    this.$nameFilter.set(value);
  }

  public onUserFilterChange(value: string): void {
    this.$userFilter.set(value);
  }

  public onTogglePin(search: SavedSearch): void {
    this.$savedSearches.update((searches: SavedSearch[]) =>
      searches.map((s: SavedSearch) =>
        s === search ? { ...s, isPinned: !s.isPinned } : s
      )
    );
  }

  public onToggleMenu(index: number): void {
    this.$openMenuIndex.update((current: number) => current === index ? -1 : index);
  }

  public formatDate(date: Date): string {
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: string = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  }
}
