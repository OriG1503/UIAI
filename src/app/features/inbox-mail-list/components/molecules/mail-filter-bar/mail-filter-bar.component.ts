import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  HostListener,
  ElementRef,
  inject,
  InputSignal,
  WritableSignal,
} from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { Language } from '../../../types/language.type';
import { MailFilter } from '../../../types/mail-filter.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { LANGUAGE_LABEL_MAP } from '../../../mapping/inbox-mail-list.label-map';

@Component({
  selector: 'app-mail-filter-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-filter-bar.component.html',
  styleUrl: './mail-filter-bar.component.scss',
})
export class MailFilterBarComponent {
  private _elementRef: ElementRef = inject(ElementRef);

  $activeFilter: InputSignal<MailFilter> = input<MailFilter>('all', { alias: 'activeFilter' });
  $isSelectMode: InputSignal<boolean> = input<boolean>(false, { alias: 'isSelectMode' });
  $sortDirection: InputSignal<SortDirection> = input<SortDirection>('desc', { alias: 'sortDirection' });
  $selectedCount: InputSignal<number> = input<number>(0, { alias: 'selectedCount' });
  $filteredCount: InputSignal<number> = input<number>(0, { alias: 'filteredCount' });

  filterChange: OutputEmitterRef<MailFilter> = output<MailFilter>();
  translateClick: OutputEmitterRef<Language> = output<Language>();
  exportModeToggle: OutputEmitterRef<void> = output<void>();
  exportClick: OutputEmitterRef<void> = output<void>();
  sortChange: OutputEmitterRef<SortDirection> = output<SortDirection>();

  $isLanguagePopupOpen: WritableSignal<boolean> = signal<boolean>(false);
  $selectedLanguage: WritableSignal<Language> = signal<Language>('en');

  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  readonly languages: Language[] = ['en', 'es', 'fr'];
  readonly languageLabels: Record<Language, string> = LANGUAGE_LABEL_MAP;
  readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const translateWrapper: HTMLElement | null = this._elementRef.nativeElement.querySelector('.translate-wrapper');
    if (translateWrapper && !translateWrapper.contains(event.target as Node)) {
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
    this.$isLanguagePopupOpen.update((value: boolean) => !value);
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
