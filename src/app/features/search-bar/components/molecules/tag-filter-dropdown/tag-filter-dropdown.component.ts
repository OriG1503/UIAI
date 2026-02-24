import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  InputSignal,
  WritableSignal,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagOption } from '../../../types/tag-option.type';
import { TAG_FILTER_LABEL_MAP } from '../../../mapping/search.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_XS } from '../../../../../shared/consts/icon-size.consts';
import { MockTagService } from '../../../../../core/services/mock-tag.service';
import { TagFilterSkeletonComponent } from '../tag-filter-skeleton/tag-filter-skeleton.component';

@Component({
  selector: 'app-tag-filter-dropdown',
  standalone: true,
  imports: [FormsModule, IconComponent, TagFilterSkeletonComponent],
  templateUrl: './tag-filter-dropdown.component.html',
  styleUrl: './tag-filter-dropdown.component.scss',
})
export class TagFilterDropdownComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_XS = ICON_SIZE_XS;

  private _mockTagService: MockTagService = inject(MockTagService);

  public $options: InputSignal<TagOption[]> = input<TagOption[]>([], { alias: 'options' });
  public $selectedValues: InputSignal<string[]> = input<string[]>([], { alias: 'selectedValues' });

  public tagsChange: OutputEmitterRef<string[]> = output<string[]>();

  @ViewChild('resultsList') private _resultsList?: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') private _searchInput?: ElementRef<HTMLInputElement>;

  public $isPopupOpen: WritableSignal<boolean> = signal<boolean>(false);
  public $searchText: WritableSignal<string> = signal<string>('');
  public $highlightedIndex: WritableSignal<number> = signal<number>(-1);

  public readonly $isLoading: WritableSignal<boolean> = this._mockTagService.$isLoading;
  public readonly $filteredOptions: WritableSignal<TagOption[]> = this._mockTagService.$filteredTags;

  public readonly translations: typeof TAG_FILTER_LABEL_MAP = TAG_FILTER_LABEL_MAP;

  constructor(private _elementRef: ElementRef) {}

  public $selectedTagOptions: Signal<TagOption[]> = computed<TagOption[]>(() => {
    const selected: string[] = this.$selectedValues();
    const options: TagOption[] = this.$options();
    return selected
      .map((value: string) => options.find((option: TagOption) => option.value === value))
      .filter((option: TagOption | undefined): option is TagOption => !!option);
  });

  private _$selectedCount: Signal<number> = computed<number>(() => this.$selectedValues().length);

  public $hasSelection: Signal<boolean> = computed<boolean>(() => this.$selectedValues().length > 0);

  public $buttonLabel: Signal<string> = computed<string>(() => {
    const count: number = this.$selectedValues().length;
    if (count === 0 && !this.$isPopupOpen()) {
      return this.translations.defaultLabel;
    }
    if (count === 1) {
      return this.translations.oneTagSelected;
    }
    return `${count} ${this.translations.tagsSelected}`;
  });

  public $isActive: Signal<boolean> = computed<boolean>(() => this.$selectedValues().length > 0 && !this.$isPopupOpen());

  public $triggerIconColor: Signal<string> = computed<string>(() =>
    this.$isPopupOpen() ? 'var(--color-white)' : 'var(--color-dark-navy)',
  );

  private _$counterLabel: Signal<string> = computed<string>(() => {
    const count: number = this.$selectedValues().length;
    if (count === 1) {
      return `${count} ${this.translations.countSelectedSingular}`;
    }
    return `${count} ${this.translations.countSelectedPlural}`;
  });

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.$isPopupOpen.set(false);
      this.$searchText.set('');
      this._mockTagService.reset();
    }
  }

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen: boolean) => !isOpen);
    if (this.$isPopupOpen()) {
      setTimeout(() => this._searchInput?.nativeElement.focus());
    } else {
      this.$searchText.set('');
      this._mockTagService.reset();
    }
  }

  public isSelected(value: string): boolean {
    return this.$selectedValues().includes(value);
  }

  public toggleTag(option: TagOption): void {
    const current: string[] = this.$selectedValues();
    if (current.includes(option.value)) {
      this.tagsChange.emit(current.filter((value: string) => value !== option.value));
    } else {
      this.tagsChange.emit([...current, option.value]);
    }
  }

  public removeTag(value: string): void {
    this.tagsChange.emit(this.$selectedValues().filter((v: string) => v !== value));
  }

  public clearAll(): void {
    this.tagsChange.emit([]);
  }

  public onSearchChange(value: string): void {
    this.$searchText.set(value);
    this.$highlightedIndex.set(-1);
    this._mockTagService.search(value);
  }

  public onSearchKeydown(event: KeyboardEvent): void {
    const options: TagOption[] = this.$filteredOptions();
    if (options.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.$highlightedIndex.update((i: number) => (i < options.length - 1 ? i + 1 : 0));
      this._scrollToHighlighted();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.$highlightedIndex.update((i: number) => (i > 0 ? i - 1 : options.length - 1));
      this._scrollToHighlighted();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const index: number = this.$highlightedIndex();
      if (index >= 0 && index < options.length) {
        this.toggleTag(options[index]);
      }
    }
  }

  private _scrollToHighlighted(): void {
    setTimeout(() => {
      const list: HTMLDivElement | undefined = this._resultsList?.nativeElement;
      if (!list) {
        return;
      }
      const items: NodeListOf<Element> = list.querySelectorAll('.result-item');
      const item: Element = items[this.$highlightedIndex()];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
