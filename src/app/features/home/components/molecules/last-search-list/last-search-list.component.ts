import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { LastSearch } from '../../../types/last-search.type';
import { SearchType } from '../../../types/search-type.type';
import { HOME_LABEL_MAP, SEARCH_TYPE_LABEL_MAP } from '../../../mapping/home.label-map';
import { LAST_SEARCH_SKELETON_COUNT } from '../../../consts/search-history-skeleton.consts';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-last-search-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './last-search-list.component.html',
  styleUrl: './last-search-list.component.scss',
})
export class LastSearchListComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  readonly labels: typeof HOME_LABEL_MAP = HOME_LABEL_MAP;
  readonly skeletonItems: number[] = Array.from({ length: LAST_SEARCH_SKELETON_COUNT }, (_: unknown, i: number) => i);

  $lastSearches: InputSignal<LastSearch[]> = input.required<LastSearch[]>({ alias: 'lastSearches' });
  $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });

  $hoveredPlayIndex: WritableSignal<number> = signal<number>(-1);
  $playPopupPosition: WritableSignal<{ top: number; right: number }> = signal({ top: 0, right: 0 });
  private _playCloseTimer: ReturnType<typeof setTimeout> | null = null;

  public onPlayEnter(index: number, event: MouseEvent): void {
    if (this._playCloseTimer !== null) {
      clearTimeout(this._playCloseTimer);
      this._playCloseTimer = null;
    }
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.$playPopupPosition.set({ top: rect.bottom, right: window.innerWidth - rect.right });
    this.$hoveredPlayIndex.set(index);
  }

  public onPlayLeave(): void {
    this._playCloseTimer = setTimeout(() => {
      this.$hoveredPlayIndex.set(-1);
      this._playCloseTimer = null;
    }, 150);
  }

  public onPopupEnter(): void {
    if (this._playCloseTimer !== null) {
      clearTimeout(this._playCloseTimer);
      this._playCloseTimer = null;
    }
  }

  public onPopupLeave(): void {
    this.$hoveredPlayIndex.set(-1);
  }

  public onPlaySelect(_viewType: 'list' | 'graph'): void {
    // TODO: navigate to search result with selected view type
    this.$hoveredPlayIndex.set(-1);
  }

  public getSearchTypeLabel(searchType: SearchType): string {
    return SEARCH_TYPE_LABEL_MAP[searchType];
  }

  public formatDate(date: Date): string {
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: string = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  }

  public formatTime(date: Date): string {
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
