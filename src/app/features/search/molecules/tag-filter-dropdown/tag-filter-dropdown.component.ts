import { Component, input, output, signal, computed, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagOption } from '../../types/tag-option.type';
import { TAG_FILTER_TRANSLATIONS } from '../../translations/search.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-tag-filter-dropdown',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './tag-filter-dropdown.component.html',
  styleUrl: './tag-filter-dropdown.component.scss'
})
export class TagFilterDropdownComponent {
  $options = input<TagOption[]>([], { alias: 'options' });
  $selectedValues = input<string[]>([], { alias: 'selectedValues' });

  tagsChange = output<string[]>();

  @ViewChild('resultsList') private _resultsList?: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') private _searchInput?: ElementRef<HTMLInputElement>;

  $isPopupOpen = signal(false);
  $searchText = signal('');
  $highlightedIndex = signal(-1);

  readonly translations = TAG_FILTER_TRANSLATIONS;

  constructor(private _elementRef: ElementRef) {}

  $selectedTagOptions = computed(() => {
    const selected = this.$selectedValues();
    const options = this.$options();
    return selected
      .map((value) => options.find((o) => o.value === value))
      .filter((o): o is TagOption => !!o);
  });

  $selectedCount = computed(() => this.$selectedValues().length);

  $hasSelection = computed(() => this.$selectedValues().length > 0);

  $filteredOptions = computed(() => {
    const searchText = this.$searchText().toLowerCase();
    const options = this.$options();

    if (!searchText) {
      return [];
    }

    return options
      .filter((option) => option.label.toLowerCase().includes(searchText))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  $buttonLabel = computed(() => {
    const count = this.$selectedValues().length;
    if (count === 0 && !this.$isPopupOpen()) {
      return this.translations.defaultLabel;
    }
    if (count === 1) {
      return this.translations.oneTagSelected;
    }
    return `${count} ${this.translations.tagsSelected}`;
  });

  $isActive = computed(() => this.$selectedValues().length > 0 && !this.$isPopupOpen());

  $counterLabel = computed(() => {
    const count = this.$selectedValues().length;
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
    }
  }

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
    if (this.$isPopupOpen()) {
      setTimeout(() => this._searchInput?.nativeElement.focus());
    } else {
      this.$searchText.set('');
    }
  }

  public isSelected(value: string): boolean {
    return this.$selectedValues().includes(value);
  }

  public toggleTag(option: TagOption): void {
    const current = this.$selectedValues();
    if (current.includes(option.value)) {
      this.tagsChange.emit(current.filter((v) => v !== option.value));
    } else {
      this.tagsChange.emit([...current, option.value]);
    }
  }

  public removeTag(value: string): void {
    this.tagsChange.emit(this.$selectedValues().filter((v) => v !== value));
  }

  public clearAll(): void {
    this.tagsChange.emit([]);
  }

  public onSearchChange(value: string): void {
    this.$searchText.set(value);
    this.$highlightedIndex.set(-1);
  }

  public onSearchKeydown(event: KeyboardEvent): void {
    const options = this.$filteredOptions();
    if (options.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.$highlightedIndex.update((i) => (i < options.length - 1 ? i + 1 : 0));
      this._scrollToHighlighted();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.$highlightedIndex.update((i) => (i > 0 ? i - 1 : options.length - 1));
      this._scrollToHighlighted();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const index = this.$highlightedIndex();
      if (index >= 0 && index < options.length) {
        this.toggleTag(options[index]);
      }
    }
  }

  private _scrollToHighlighted(): void {
    setTimeout(() => {
      const list = this._resultsList?.nativeElement;
      if (!list) {
        return;
      }
      const items = list.querySelectorAll('.result-item');
      const item = items[this.$highlightedIndex()];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
