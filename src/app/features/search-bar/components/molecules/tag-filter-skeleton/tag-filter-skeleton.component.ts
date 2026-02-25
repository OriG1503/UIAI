import { Component } from '@angular/core';
import { TAG_SKELETON_COUNT } from '../../../consts/tag-filter.consts';

@Component({
  selector: 'app-tag-filter-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './tag-filter-skeleton.component.html',
  styleUrl: './tag-filter-skeleton.component.scss',
})
export class TagFilterSkeletonComponent {
  public readonly skeletonItems: number[] = Array.from({ length: TAG_SKELETON_COUNT }, (_: undefined, i: number) => i);
}
