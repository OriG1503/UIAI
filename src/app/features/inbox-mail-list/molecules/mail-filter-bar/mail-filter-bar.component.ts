import { Component, input, output, signal } from '@angular/core';
import {
  Language,
  MailFilter,
  SortDirection,
  LANGUAGE_LABELS,
  INBOX_TRANSLATIONS
} from '../../../../shared';
import { IconComponent } from '../../../../shared/atoms';

@Component({
  selector: 'app-mail-filter-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-filter-bar.component.html',
  styleUrl: './mail-filter-bar.component.scss',
})
export class MailFilterBarComponent {
  $activeFilter = input<MailFilter>('all', { alias: 'activeFilter' });
  $isSelectMode = input<boolean>(false, { alias: 'isSelectMode' });
  $sortDirection = input<SortDirection>('desc', { alias: 'sortDirection' });
  $selectedCount = input<number>(0, { alias: 'selectedCount' });

  filterChange = output<MailFilter>();
  translateClick = output<Language>();
  exportModeToggle = output<void>();
  exportClick = output<void>();
  sortChange = output<SortDirection>();

  $isLanguagePopupOpen = signal<boolean>(false);
  $selectedLanguage = signal<Language>('en');

  readonly languages: Language[] = ['en', 'es', 'fr'];
  readonly languageLabels = LANGUAGE_LABELS;
  readonly translations = INBOX_TRANSLATIONS;

  onFilterClick(filter: MailFilter): void {
    this.filterChange.emit(filter);
  }

  onSortToggle(): void {
    const newDirection: SortDirection = this.$sortDirection() === 'desc' ? 'asc' : 'desc';
    this.sortChange.emit(newDirection);
  }

  onTranslateClick(): void {
    this.$isLanguagePopupOpen.update((value) => !value);
  }

  onLanguageSelect(language: Language): void {
    this.$selectedLanguage.set(language);
    this.$isLanguagePopupOpen.set(false);
    this.translateClick.emit(language);
  }

  onExcelClick(): void {
    this.exportModeToggle.emit();
  }

  onExportClick(): void {
    this.exportClick.emit();
  }
}
