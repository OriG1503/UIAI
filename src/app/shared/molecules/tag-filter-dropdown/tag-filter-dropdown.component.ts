import { Component, input, output, signal, computed, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagOption } from '../../types';
import { PLACEHOLDER_TRANSLATIONS } from '../../translations';
import { IconComponent } from '../../atoms';

@Component({
  selector: 'app-tag-filter-dropdown',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './tag-filter-dropdown.component.html',
  styleUrl: './tag-filter-dropdown.component.scss',
})
export class TagFilterDropdownComponent {
  $value = input<string | null>(null, { alias: 'value' });
  valueChange = output<string | null>();

  $options = input<TagOption[]>([], { alias: 'options' });
  $placeholder = input<string>(PLACEHOLDER_TRANSLATIONS.selectTag, { alias: 'placeholder' });

  $searchText = signal('');
  $isDropdownOpen = signal(false);

  constructor(private _elementRef: ElementRef) {}

  $filteredOptions = computed(() => {
    const searchText = this.$searchText().toLowerCase();
    const options = this.$options();

    if (!searchText) {
      return options;
    }

    return options.filter(
      (option) => option.label.toLowerCase().includes(searchText) || option.value.toLowerCase().includes(searchText)
    );
  });

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.$isDropdownOpen.set(false);
    }
  }

  onInputFocus(): void {
    this.$isDropdownOpen.set(true);
  }

  onInputChange(value: string): void {
    this.$searchText.set(value);
    this.$isDropdownOpen.set(true);
    this.valueChange.emit(value || null);
  }

  selectOption(option: TagOption): void {
    this.$searchText.set(option.label);
    this.valueChange.emit(option.value);
    this.$isDropdownOpen.set(false);
  }
}
