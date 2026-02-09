import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { TAG_SCROLL_AMOUNT } from '../../constants/tag-filter-bar.constants';

@Component({
  selector: 'app-tag-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './tag-filter-bar.component.html',
  styleUrl: './tag-filter-bar.component.scss'
})
export class TagFilterBarComponent {
  @ViewChild('scrollContainer') private _scrollContainer!: ElementRef<HTMLDivElement>;

  readonly tags = ['Projects', 'Reports', 'Meetings', 'Budget', 'HR', 'Clients', 'Technology', 'Security', 'Marketing', 'Sales'];

  $selectedTags = signal<Set<string>>(new Set());

  public onScrollLeft(): void {
    this._scrollContainer.nativeElement.scrollLeft -= TAG_SCROLL_AMOUNT;
  }

  public onScrollRight(): void {
    this._scrollContainer.nativeElement.scrollLeft += TAG_SCROLL_AMOUNT;
  }

  public onTagClick(tag: string): void {
    this.$selectedTags.update((selected) => {
      const newSelected = new Set(selected);
      if (newSelected.has(tag)) {
        newSelected.delete(tag);
      } else {
        newSelected.add(tag);
      }
      return newSelected;
    });
  }

  public isTagSelected(tag: string): boolean {
    return this.$selectedTags().has(tag);
  }
}
