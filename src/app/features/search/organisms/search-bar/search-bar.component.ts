import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TagFilterDropdownComponent } from '../../molecules/tag-filter-dropdown/tag-filter-dropdown.component';
import { DateRangePickerComponent } from '../../molecules/date-range-picker/date-range-picker.component';
import { SearchModeSwitchComponent } from '../../molecules/search-mode-switch/search-mode-switch.component';
import { SearchInputComponent } from '../../molecules/search-input/search-input.component';
import { RunButtonComponent } from '../../molecules/run-button/run-button.component';
import { SaveSearchButtonComponent } from '../../molecules/save-search-button/save-search-button.component';
import { AlertButtonComponent } from '../../molecules/alert-button/alert-button.component';
import { TagOption } from '../../types/tag-option.type';
import { SearchModeType } from '../../types/search-mode-type.type';

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
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  $tag = signal<string | null>(null);
  $dateRange = signal<Date[] | null>(null);
  $searchMode = signal<SearchModeType>('regular');
  $searchText = signal<string>('');

  tagOptions: TagOption[] = [
    { label: 'תגית 1', value: 'tag1' },
    { label: 'תגית 2', value: 'tag2' },
    { label: 'תגית 3', value: 'tag3' },
  ];

  constructor(private _router: Router) {}

  public onTagChange(tag: string | null): void {
    this.$tag.set(tag);
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

  public onRun(): void {
    const query = {
      tag: this.$tag(),
      dateRange: this.$dateRange(),
      searchMode: this.$searchMode(),
      searchText: this.$searchText(),
    };
    console.log('Running search:', query);
    this._router.navigate(['/search', 'list']);
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
