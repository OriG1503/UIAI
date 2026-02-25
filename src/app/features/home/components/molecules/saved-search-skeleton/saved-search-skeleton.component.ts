import { Component } from '@angular/core';
import { SAVED_SEARCH_SKELETON_COUNT } from '../../../consts/search-history-skeleton.consts';

@Component({
  selector: 'app-saved-search-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './saved-search-skeleton.component.html',
  styleUrl: './saved-search-skeleton.component.scss',
})
export class SavedSearchSkeletonComponent {
  public readonly skeletonItems: number[] = Array.from({ length: SAVED_SEARCH_SKELETON_COUNT }, (_: undefined, i: number) => i);
}
