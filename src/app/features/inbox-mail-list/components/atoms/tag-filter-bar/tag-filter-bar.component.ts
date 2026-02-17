import { Component, ElementRef, ViewChild, signal, WritableSignal } from '@angular/core';
import { TAG_SCROLL_AMOUNT } from '../../../consts/tag-filter-bar.consts';

@Component({
  selector: 'app-tag-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './tag-filter-bar.component.html',
  styleUrl: './tag-filter-bar.component.scss',
})
export class TagFilterBarComponent {
  @ViewChild('scrollContainer') private _scrollContainer!: ElementRef<HTMLDivElement>;

  readonly tags: string[] = [
    'Projects',
    'Reports',
    'Meetings',
    'Budget',
    'HR',
    'Clients',
    'Technology',
    'Security',
    'Marketing',
    'Sales',
  ];

  $selectedTags: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  public onScrollLeft(): void {
    this._scrollContainer.nativeElement.scrollLeft -= TAG_SCROLL_AMOUNT;
  }

  public onScrollRight(): void {
    this._scrollContainer.nativeElement.scrollLeft += TAG_SCROLL_AMOUNT;
  }

  public onTagClick(tag: string): void {
    this.$selectedTags.update((selected: Set<string>) => {
      const newSelected: Set<string> = new Set(selected);
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
