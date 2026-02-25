import { Component, ElementRef, ViewChild, signal, WritableSignal } from '@angular/core';
import { TAG_SCROLL_AMOUNT } from '../../../consts/tag-filter-bar.consts';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_XS } from '../../../../../shared/consts/icon-size.consts';

@Component({
  selector: 'app-tag-filter-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tag-filter-bar.component.html',
  styleUrl: './tag-filter-bar.component.scss',
})
export class TagFilterBarComponent {
  @ViewChild('scrollContainer') private _scrollContainer!: ElementRef<HTMLDivElement>;

  public readonly ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_XS = ICON_SIZE_XS;

  public readonly tags: string[] = [
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

  private _$selectedTag: WritableSignal<string> = signal<string>(this.tags[0]);

  public onScrollLeft(): void {
    this._scrollContainer.nativeElement.scrollLeft -= TAG_SCROLL_AMOUNT;
  }

  public onScrollRight(): void {
    this._scrollContainer.nativeElement.scrollLeft += TAG_SCROLL_AMOUNT;
  }

  public onTagClick(tag: string): void {
    this._$selectedTag.set(tag);
  }

  public isTagSelected(tag: string): boolean {
    return this._$selectedTag() === tag;
  }
}
