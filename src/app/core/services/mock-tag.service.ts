// TODO: Replace with real TagService that fetches from the NestJS HTTP server.
// Contract: must expose `$isLoading: WritableSignal<boolean>`, `$filteredTags: WritableSignal<TagOption[]>`,
//           `search(searchText: string): void`, `reset(): void`
// API: GET /tags?q=<searchText>
import { Injectable, signal, WritableSignal } from '@angular/core';
import { TagOption } from '../../features/search-bar/types/tag-option.type';
import { TAG_OPTIONS } from '../../features/search-bar/consts/tag-filter.consts';
import { TAG_SEARCH_DELAY } from '../../features/search-bar/consts/tag-filter.consts';

@Injectable({
  providedIn: 'root',
})
export class MockTagService {
  readonly $isLoading: WritableSignal<boolean> = signal<boolean>(false);
  readonly $filteredTags: WritableSignal<TagOption[]> = signal<TagOption[]>([]);

  private _searchTimeout: ReturnType<typeof setTimeout> | null = null;

  public search(searchText: string): void {
    this._clearTimeout();

    if (!searchText.trim()) {
      this.$isLoading.set(false);
      this.$filteredTags.set([]);
      return;
    }

    this.$isLoading.set(true);

    this._searchTimeout = setTimeout((): void => {
      const lowerText: string = searchText.toLowerCase();
      const results: TagOption[] = TAG_OPTIONS.filter((option: TagOption) =>
        option.label.toLowerCase().includes(lowerText),
      ).sort((a: TagOption, b: TagOption) => a.label.localeCompare(b.label));
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
