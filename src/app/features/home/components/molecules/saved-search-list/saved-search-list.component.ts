import { Component, computed, HostListener, input, signal, InputSignal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SavedSearch } from '../../../types/saved-search.type';
import { HOME_LABEL_MAP } from '../../../mapping/home.label-map';
import { CURRENT_USERNAME, MAX_SAVED_SEARCH_NAME_LENGTH } from '../../../consts/saved-search.consts';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_XS, ICON_SIZE_SM } from '../../../../../shared/consts/icon-size.consts';
import { HoverPopupComponent } from '../../../../../shared/molecules/hover-popup/hover-popup.component';
import { PopupOption } from '../../../../../shared/types/popup-option.type';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { SavedSearchSkeletonComponent } from '../saved-search-skeleton/saved-search-skeleton.component';

@Component({
  selector: 'app-saved-search-list',
  standalone: true,
  imports: [FormsModule, IconComponent, HoverPopupComponent, FormatDatePipe, SavedSearchSkeletonComponent],
  templateUrl: './saved-search-list.component.html',
  styleUrl: './saved-search-list.component.scss',
})
export class SavedSearchListComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_XS = ICON_SIZE_XS;
  public readonly ICON_SIZE_SM = ICON_SIZE_SM;
  public readonly labels: typeof HOME_LABEL_MAP = HOME_LABEL_MAP;
  public readonly MAX_NAME_LENGTH: number = MAX_SAVED_SEARCH_NAME_LENGTH;
  public readonly playOptions: PopupOption[] = [
    { value: 'list', label: HOME_LABEL_MAP.listView, icon: ICON_NAMES.LIST },
    { value: 'graph', label: HOME_LABEL_MAP.graphView, icon: ICON_NAMES.CHART_BAR },
  ];

  public $savedSearches: InputSignal<SavedSearch[]> = input.required<SavedSearch[]>({ alias: 'savedSearches' });
  public $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });

  public $nameFilter: WritableSignal<string> = signal<string>('');
  public $userFilter: WritableSignal<string> = signal<string>('');
  public $openMenuIndex: WritableSignal<number> = signal<number>(-1);
  public $editingIndex: WritableSignal<number> = signal<number>(-1);
  private _$mutationTick: WritableSignal<number> = signal<number>(0);
  public $editingName: WritableSignal<string> = signal<string>('');
  public $glowingSearch: WritableSignal<SavedSearch | null> = signal<SavedSearch | null>(null);
  private _pendingGlowSearch: SavedSearch | null = null;

  public $hasFilters: Signal<boolean> = computed<boolean>(
    () => this.$nameFilter().trim() !== '' || this.$userFilter().trim() !== '',
  );

  private _$hasOwnSearches: Signal<boolean> = computed<boolean>(() =>
    this.$savedSearches().some((search: SavedSearch) => search.username === CURRENT_USERNAME),
  );

  public $filteredSavedSearches: Signal<SavedSearch[]> = computed<SavedSearch[]>(() => {
    this._$mutationTick();
    const nameFilter: string = this.$nameFilter().trim().toLowerCase();
    const userFilter: string = this.$userFilter().trim().toLowerCase();
    const isUserFiltering: boolean = userFilter !== '';
    const isSearching: boolean = nameFilter !== '' || isUserFiltering;
    const hasOwn: boolean = this._$hasOwnSearches();

    const filtered: SavedSearch[] = this.$savedSearches().filter((search: SavedSearch) => {
      const isNameMatch: boolean = nameFilter === '' || search.name.toLowerCase().includes(nameFilter);

      if (!hasOwn) {
        return isNameMatch && (!isUserFiltering || search.username.toLowerCase().includes(userFilter));
      }

      const isUserMatch: boolean = isUserFiltering
        ? search.username.toLowerCase().includes(userFilter)
        : search.username === CURRENT_USERNAME;
      const isPinnedVisible: boolean = !isSearching && search.isPinned;
      return isNameMatch && (isUserMatch || isPinnedVisible);
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

  public isOwnSearch(search: SavedSearch): boolean {
    return search.username === CURRENT_USERNAME;
  }

  public pinIconColor(search: SavedSearch): string {
    return search.isPinned ? 'var(--color-red)' : 'var(--color-dark-navy)';
  }

  public menuIconColor(index: number): string {
    return this.$openMenuIndex() === index ? 'var(--color-white)' : 'var(--color-dark-navy)';
  }

  public onNameFilterChange(value: string): void {
    this.$nameFilter.set(value);
  }

  public onUserFilterChange(value: string): void {
    this.$userFilter.set(value);
  }

  public onClearFilters(): void {
    this.$nameFilter.set('');
    this.$userFilter.set('');
  }

  public onTogglePin(search: SavedSearch): void {
    search.isPinned = !search.isPinned;
    this._$mutationTick.update((n: number) => n + 1);
    // TODO: dispatch pin toggle action to store
  }

  public onPlaySelect(_viewType: string): void {
    // TODO: navigate to search result with selected view type
  }

  public onToggleMenu(index: number): void {
    this.$openMenuIndex.update((current: number) => (current === index ? -1 : index));
  }

  public onDuplicate(search: SavedSearch): void {
    const duplicated: SavedSearch = {
      name: search.name,
      username: CURRENT_USERNAME,
      date: new Date(),
      isPinned: false,
    };
    this.$savedSearches().unshift(duplicated);
    this.$openMenuIndex.set(-1);
    this.$nameFilter.set('');
    this.$userFilter.set('');

    if (this.isOwnSearch(search)) {
      this.$editingIndex.set(0);
      this.$editingName.set(duplicated.name);
      this._pendingGlowSearch = duplicated;
    } else {
      this.$glowingSearch.set(duplicated);
      setTimeout(() => {
        this.$glowingSearch.set(null);
      }, 3000);
    }
  }

  public onEdit(index: number, search: SavedSearch): void {
    this.$editingIndex.set(index);
    this.$editingName.set(search.name);
    this.$openMenuIndex.set(-1);
  }

  public onEditNameChange(value: string): void {
    this.$editingName.set(value);
  }

  public onEditConfirm(search: SavedSearch): void {
    const newName: string = this.$editingName().trim();
    if (newName !== '') {
      search.name = newName;
    }
    this.$nameFilter.set('');
    this.$userFilter.set('');
    this.$glowingSearch.set(this._pendingGlowSearch ?? search);
    this._pendingGlowSearch = null;
    setTimeout(() => {
      this.$glowingSearch.set(null);
    }, 3000);
    this.cancelEdit();
  }

  public onEditKeydown(event: KeyboardEvent, search: SavedSearch): void {
    if (event.key === 'Enter') {
      this.onEditConfirm(search);
    }
    if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  public onOverlayClick(): void {
    this.cancelEdit();
  }

  public onDelete(search: SavedSearch): void {
    const index: number = this.$savedSearches().indexOf(search);
    if (index >= 0) {
      this.$savedSearches().splice(index, 1);
    }
    this.$openMenuIndex.set(-1);
  }

  private cancelEdit(): void {
    if (this._pendingGlowSearch) {
      const index: number = this.$savedSearches().indexOf(this._pendingGlowSearch);
      if (index >= 0) {
        this.$savedSearches().splice(index, 1);
      }
      this._pendingGlowSearch = null;
    }
    this.$editingIndex.set(-1);
    this.$editingName.set('');
  }
}
