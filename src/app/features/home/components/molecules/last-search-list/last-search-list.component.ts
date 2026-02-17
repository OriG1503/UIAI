import { Component, input } from '@angular/core';
import { LastSearch } from '../../../types/last-search.type';
import { SearchType } from '../../../types/search-type.type';
import { HOME_LABEL_MAP, SEARCH_TYPE_LABEL_MAP } from '../../../mapping/home.label-map';
import { LAST_SEARCH_SKELETON_COUNT } from '../../../constants/search-history-skeleton.constants';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-last-search-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './last-search-list.component.html',
  styleUrl: './last-search-list.component.scss'
})
export class LastSearchListComponent {
  readonly ICON_NAMES = ICON_NAMES;
  readonly labels = HOME_LABEL_MAP;
  readonly skeletonItems: number[] = Array.from({ length: LAST_SEARCH_SKELETON_COUNT }, (_: unknown, i: number) => i);

  $lastSearches = input.required<LastSearch[]>({ alias: 'lastSearches' });
  $isLoading = input<boolean>(false, { alias: 'isLoading' });

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
