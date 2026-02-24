import { Component, input, signal, InputSignal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchBarVariant } from '../../../types/search-bar-variant.type';
import { TagFilterDropdownComponent } from '../../molecules/tag-filter-dropdown/tag-filter-dropdown.component';
import { DateRangePickerComponent } from '../../molecules/date-range-picker/date-range-picker.component';
import { SearchModeSwitchComponent } from '../../molecules/search-mode-switch/search-mode-switch.component';
import { SearchInputComponent } from '../../molecules/search-input/search-input.component';
import { RunButtonComponent } from '../../molecules/run-button/run-button.component';
import { AlertButtonComponent } from '../../molecules/alert-button/alert-button.component';
import { ThemeToggleComponent } from '../../../../../shared/atoms/theme-toggle/theme-toggle.component';
import { SpecialCharsWarningComponent } from '../../molecules/special-chars-warning/special-chars-warning.component';
import { SearchModeType } from '../../../types/search-mode-type.type';
import { SearchViewType } from '../../../types/search-view-type.type';
import { TAG_OPTIONS } from '../../../consts/tag-filter.consts';
import { SPECIAL_CHARS_PATTERN } from '../../../consts/special-chars.consts';
import { TagOption } from '../../../types/tag-option.type';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    TagFilterDropdownComponent,
    DateRangePickerComponent,
    SearchModeSwitchComponent,
    SearchInputComponent,
    RunButtonComponent,
    AlertButtonComponent,
    ThemeToggleComponent,
    SpecialCharsWarningComponent,
    RouterLink,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  public $isLeftSectionVisible: InputSignal<boolean> = input<boolean>(true, { alias: 'isLeftSectionVisible' });
  public $isLogoVisible: InputSignal<boolean> = input<boolean>(true, { alias: 'isLogoVisible' });
  public $variant: InputSignal<SearchBarVariant> = input<SearchBarVariant>('default', { alias: 'variant' });

  public $selectedTags: WritableSignal<string[]> = signal<string[]>([]);
  public $dateRange: WritableSignal<Date[] | null> = signal<Date[] | null>(null);
  public $searchMode: WritableSignal<SearchModeType> = signal<SearchModeType>('regular');
  public $searchText: WritableSignal<string> = signal<string>('');
  public $isSpecialCharsWarningOpen: WritableSignal<boolean> = signal<boolean>(false);

  public readonly tagOptions: TagOption[] = TAG_OPTIONS;

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
    this.$searchMode.set('advanced');
  }

  public onRun(viewType: SearchViewType): void {
    const hasSpecialChars: boolean = SPECIAL_CHARS_PATTERN.test(this.$searchText());
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
    const query: { tags: string[]; dateRange: Date[] | null; searchMode: SearchModeType; searchText: string } = {
      tags: this.$selectedTags(),
      dateRange: this.$dateRange(),
      searchMode: this.$searchMode(),
      searchText: this.$searchText(),
    };
    // TODO: connect to real service / NgRx action
    console.log('Running search:', query);
    return this._router.navigate(['/search', viewType]);
  }

  public onOpenIssue(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open issue clicked');
  }

  public onOpenRequest(): void {
    // TODO: connect to real service / NgRx action
    console.log('Open request clicked');
  }
}
