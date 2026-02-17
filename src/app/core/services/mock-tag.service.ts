import { Injectable, signal } from '@angular/core';
import { TagOption } from '../../features/search-bar/types/tag-option.type';
import { TAG_OPTIONS } from '../../features/search-bar/constants/tag-filter.constants';
import { TAG_SEARCH_DELAY } from '../../features/search-bar/constants/tag-filter.constants';

@Injectable({
  providedIn: 'root'
})
export class MockTagService {
  readonly $isLoading = signal(false);
  readonly $filteredTags = signal<TagOption[]>([]);

  private _searchTimeout: ReturnType<typeof setTimeout> | null = null;

  public search(searchText: string): void {
    this._clearTimeout();

    if (!searchText.trim()) {
      this.$isLoading.set(false);
      this.$filteredTags.set([]);
      return;
    }

    this.$isLoading.set(true);

    this._searchTimeout = setTimeout(() => {
      const lowerText: string = searchText.toLowerCase();
      const results: TagOption[] = TAG_OPTIONS.filter((option) => option.label.toLowerCase().includes(lowerText)).sort(
        (a, b) => a.label.localeCompare(b.label)
      );
      this.$filteredTags.set(results);
      this.$isLoading.set(false);
    }, TAG_SEARCH_DELAY);
  }

  public reset(): void {
    this._clearTimeout();
    this.$isLoading.set(false);
    this.$filteredTags.set([]);
  }

  private _clearTimeout(): void {
    if (this._searchTimeout !== null) {
      clearTimeout(this._searchTimeout);
      this._searchTimeout = null;
    }
  }
}
