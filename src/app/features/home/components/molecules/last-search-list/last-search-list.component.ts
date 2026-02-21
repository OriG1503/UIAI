import { Component, input, InputSignal } from '@angular/core';
import { LastSearch } from '../../../types/last-search.type';
import { SearchType } from '../../../types/search-type.type';
import { HOME_LABEL_MAP, SEARCH_TYPE_LABEL_MAP } from '../../../mapping/home.label-map';
import { LAST_SEARCH_SKELETON_COUNT } from '../../../consts/search-history-skeleton.consts';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { HoverPopupComponent } from '../../../../../shared/molecules/hover-popup/hover-popup.component';
import { PopupOption } from '../../../../../shared/types/popup-option.type';

@Component({
  selector: 'app-last-search-list',
  standalone: true,
  imports: [IconComponent, HoverPopupComponent],
  templateUrl: './last-search-list.component.html',
  styleUrl: './last-search-list.component.scss',
})
export class LastSearchListComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  readonly labels: typeof HOME_LABEL_MAP = HOME_LABEL_MAP;
  readonly skeletonItems: number[] = Array.from({ length: LAST_SEARCH_SKELETON_COUNT }, (_: unknown, i: number) => i);
  readonly playOptions: PopupOption[] = [
    { value: 'list', label: HOME_LABEL_MAP.listView, icon: ICON_NAMES.LIST },
    { value: 'graph', label: HOME_LABEL_MAP.graphView, icon: ICON_NAMES.CHART_BAR },
  ];

  $lastSearches: InputSignal<LastSearch[]> = input.required<LastSearch[]>({ alias: 'lastSearches' });
  $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });

  public onPlaySelect(_viewType: string): void {
    // TODO: navigate to search result with selected view type
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
