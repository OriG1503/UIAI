import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { INBOX_TRANSLATIONS } from '../../../../../shared/translations/inbox.translations';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';
import { Language } from '../../../types/language.type';
import { MailFilter } from '../../../types/mail-filter.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { LANGUAGE_LABELS } from '../../../mapping/inbox-mail-list.label-map';

@Component({
  selector: 'app-mail-filter-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-filter-bar.component.html',
  styleUrl: './mail-filter-bar.component.scss',
})
export class MailFilterBarComponent {
  private _elementRef = inject(ElementRef);

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

  readonly ICON_NAMES = ICON_NAMES;
  readonly languages: Language[] = ['en', 'es', 'fr'];
  readonly languageLabels = LANGUAGE_LABELS;
  readonly translations = INBOX_TRANSLATIONS;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const translateWrapper = this._elementRef.nativeElement.querySelector('.translate-wrapper');
    if (translateWrapper && !translateWrapper.contains(event.target)) {
      this.$isLanguagePopupOpen.set(false);
    }
  }

  public onFilterClick(filter: MailFilter): void {
    this.filterChange.emit(filter);
  }

  public onSortToggle(): void {
    const newDirection: SortDirection = this.$sortDirection() === 'desc' ? 'asc' : 'desc';
    this.sortChange.emit(newDirection);
  }

  public onTranslateClick(): void {
    this.$isLanguagePopupOpen.update((value) => !value);
  }

  public onLanguageSelect(language: Language): void {
    this.$selectedLanguage.set(language);
    this.$isLanguagePopupOpen.set(false);
    this.translateClick.emit(language);
  }

  public onExcelClick(): void {
    this.exportModeToggle.emit();
  }

  public onExportClick(): void {
    this.exportClick.emit();
  }
}
