import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
  InputSignal,
  WritableSignal,
  Signal,
} from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_SM, ICON_SIZE_LG } from '../../../../../shared/consts/icon-size.consts';
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

  public $activeFilter: InputSignal<MailFilter> = input<MailFilter>('all', { alias: 'activeFilter' });
  public $isSelectMode: InputSignal<boolean> = input<boolean>(false, { alias: 'isSelectMode' });
  public $sortDirection: InputSignal<SortDirection> = input<SortDirection>('desc', { alias: 'sortDirection' });
  public $selectedCount: InputSignal<number> = input<number>(0, { alias: 'selectedCount' });
  public $filteredCount: InputSignal<number> = input<number>(0, { alias: 'filteredCount' });

  public filterChange: OutputEmitterRef<MailFilter> = output<MailFilter>();
  public translateClick: OutputEmitterRef<Language> = output<Language>();
  public exportModeToggle: OutputEmitterRef<void> = output<void>();
  public exportClick: OutputEmitterRef<void> = output<void>();
  public sortChange: OutputEmitterRef<SortDirection> = output<SortDirection>();

  public $isLanguagePopupOpen: WritableSignal<boolean> = signal<boolean>(false);
  public $selectedLanguage: WritableSignal<Language> = signal<Language>('en');

  public $languageIconColor: Signal<string> = computed<string>(() =>
    this.$isLanguagePopupOpen() ? 'var(--color-blue)' : 'var(--color-dark-navy)',
  );

  public $selectModeIconColor: Signal<string> = computed<string>(() =>
    this.$isSelectMode() ? 'var(--color-blue)' : 'var(--color-dark-navy)',
  );

  public $unreadFilterIconColor: Signal<string> = computed<string>(() =>
    this.$activeFilter() === 'unread' ? 'var(--color-blue)' : 'var(--color-dark-navy)',
  );

  public $readFilterIconColor: Signal<string> = computed<string>(() =>
    this.$activeFilter() === 'read' ? 'var(--color-blue)' : 'var(--color-dark-navy)',
  );

  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_SM = ICON_SIZE_SM;
  public readonly ICON_SIZE_LG = ICON_SIZE_LG;
  public readonly languages: Language[] = ['en', 'es', 'fr'];
  public readonly languageLabels: Record<Language, string> = LANGUAGE_LABEL_MAP;
  public readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const translateWrapper: HTMLElement | null = this._elementRef.nativeElement.querySelector('.translate-wrapper');
    if (translateWrapper && !translateWrapper.contains(event.target as HTMLElement)) {
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
