import { Component, input, InputSignal } from '@angular/core';
import { LastSearch } from '../../../types/last-search.type';
import { SearchType } from '../../../types/search-type.type';
import { HOME_LABEL_MAP, SEARCH_TYPE_LABEL_MAP } from '../../../mapping/home.label-map';
import { LAST_SEARCH_SKELETON_COUNT } from '../../../consts/search-history-skeleton.consts';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_XS } from '../../../../../shared/consts/icon-size.consts';
import { HoverPopupComponent } from '../../../../../shared/molecules/hover-popup/hover-popup.component';
import { PopupOption } from '../../../../../shared/types/popup-option.type';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../../../shared/pipes/format-time.pipe';

@Component({
  selector: 'app-last-search-list',
  standalone: true,
  imports: [IconComponent, HoverPopupComponent, FormatDatePipe, FormatTimePipe],
  templateUrl: './last-search-list.component.html',
  styleUrl: './last-search-list.component.scss',
})
export class LastSearchListComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_XS = ICON_SIZE_XS;
  public readonly labels: typeof HOME_LABEL_MAP = HOME_LABEL_MAP;
  public readonly skeletonItems: number[] = Array.from({ length: LAST_SEARCH_SKELETON_COUNT }, (_: undefined, i: number) => i);
  public readonly playOptions: PopupOption[] = [
    { value: 'list', label: HOME_LABEL_MAP.listView, icon: ICON_NAMES.LIST },
    { value: 'graph', label: HOME_LABEL_MAP.graphView, icon: ICON_NAMES.CHART_BAR },
  ];

  public $lastSearches: InputSignal<LastSearch[]> = input.required<LastSearch[]>({ alias: 'lastSearches' });
  public $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });

  public onPlaySelect(_viewType: string): void {
    // TODO: navigate to search result with selected view type
  }

  public getSearchTypeLabel(searchType: SearchType): string {
    return SEARCH_TYPE_LABEL_MAP[searchType];
  }

}
