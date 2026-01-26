import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  TagFilterDropdownComponent,
  TagOption,
  DateRangePickerComponent,
  SearchModeSwitchComponent,
  SearchModeType,
  SearchInputComponent,
  RunButtonComponent,
  SaveSearchButtonComponent,
  AlertButtonComponent,
} from '../../../../shared';

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

  onAdvancedClick(): void {
    console.log('Advanced query clicked');
  }

  onRun(): void {
    const query = {
      tag: this.$tag(),
      dateRange: this.$dateRange(),
      searchMode: this.$searchMode(),
      searchText: this.$searchText(),
    };
    console.log('Running search:', query);
    this._router.navigate(['/search', 'list']);
  }

  onSaveSearch(name: string): void {
    console.log('Saving search as:', name);
  }

  onAlertClick(): void {
    console.log('Alert clicked');
  }
}
