import { Component, input, output, signal, computed, ElementRef, HostListener } from '@angular/core';
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

  $isPopupOpen = signal(false);
  $searchText = signal('');

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

    return options.filter((option) => option.label.toLowerCase().includes(searchText));
  });

  $buttonLabel = computed(() => {
    const count = this.$selectedValues().length;
    const isOpen = this.$isPopupOpen();
    if (isOpen || count === 0) {
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
    if (!this.$isPopupOpen()) {
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
  }
}
