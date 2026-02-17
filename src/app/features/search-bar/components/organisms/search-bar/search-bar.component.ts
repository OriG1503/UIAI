import { Component, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchBarVariant } from '../../../types/search-bar-variant.type';
import { TagFilterDropdownComponent } from '../../molecules/tag-filter-dropdown/tag-filter-dropdown.component';
import { DateRangePickerComponent } from '../../molecules/date-range-picker/date-range-picker.component';
import { SearchModeSwitchComponent } from '../../molecules/search-mode-switch/search-mode-switch.component';
import { SearchInputComponent } from '../../molecules/search-input/search-input.component';
import { RunButtonComponent } from '../../molecules/run-button/run-button.component';
import { SaveSearchButtonComponent } from '../../molecules/save-search-button/save-search-button.component';
import { AlertButtonComponent } from '../../molecules/alert-button/alert-button.component';
import { ThemeToggleComponent } from '../../../../../shared/atoms/theme-toggle/theme-toggle.component';
import { SpecialCharsWarningComponent } from '../../molecules/special-chars-warning/special-chars-warning.component';
import { SearchModeType } from '../../../types/search-mode-type.type';
import { SearchViewType } from '../../../types/search-view-type.type';
import { TAG_OPTIONS } from '../../../constants/tag-filter.constants';
import { SPECIAL_CHARS_PATTERN } from '../../../constants/special-chars.constants';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TagFilterDropdownComponent,
    DateRangePickerComponent,
    SearchModeSwitchComponent,
    SearchInputComponent,
    RunButtonComponent,
    SaveSearchButtonComponent,
    AlertButtonComponent,
    ThemeToggleComponent,
    SpecialCharsWarningComponent,
    RouterLink
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  $isLeftSectionVisible = input<boolean>(true, { alias: 'isLeftSectionVisible' });
  $isLogoVisible = input<boolean>(true, { alias: 'isLogoVisible' });
  $variant = input<SearchBarVariant>('default', { alias: 'variant' });

  $selectedTags = signal<string[]>([]);
  $dateRange = signal<Date[] | null>(null);
  $searchMode = signal<SearchModeType>('regular');
  $searchText = signal<string>('');
  $isSpecialCharsWarningOpen = signal<boolean>(false);

  readonly tagOptions = TAG_OPTIONS;

  constructor(private _router: Router) {}

  public onTagsChange(tags: string[]): void {
    this.$selectedTags.set(tags);
  }

  public onDateRangeChange(dateRange: Date[] | null): void {
    this.$dateRange.set(dateRange);
  }

  public onSearchModeChange(mode: SearchModeType): void {
    this.$searchMode.set(mode);
  }

  public onSearchTextChange(text: string): void {
    this.$searchText.set(text);
  }

  public onAdvancedClick(): void {
    console.log('Advanced query clicked');
  }

  public onRun(viewType: SearchViewType): void {
    const hasSpecialChars = SPECIAL_CHARS_PATTERN.test(this.$searchText());
    this._executeSearch(viewType).then(() => {
      if (hasSpecialChars) {
        this.$isSpecialCharsWarningOpen.set(true);
      }
    });
  }

  public onWarningConfirm(): void {
    this.$isSpecialCharsWarningOpen.set(false);
  }

  private _executeSearch(viewType: SearchViewType): Promise<boolean> {
    const query = {
      tags: this.$selectedTags(),
      dateRange: this.$dateRange(),
      searchMode: this.$searchMode(),
      searchText: this.$searchText()
    };
    console.log('Running search:', query);
    return this._router.navigate(['/search', viewType]);
  }

  public onSaveSearch(name: string): void {
    console.log('Saving search as:', name);
  }

  public onOpenIssue(): void {
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    console.log('Open request clicked');
  }
}
