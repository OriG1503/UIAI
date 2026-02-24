import {
  Component,
  signal,
  computed,
  inject,
  effect,
  untracked,
  input,
  output,
  ElementRef,
  InputSignal,
  OutputEmitterRef,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { Language } from '../../../types/language.type';
import { MailFilter } from '../../../types/mail-filter.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { MockMailService } from '../../../../../core/services/mock-mail.service';
import { SelectedMailService } from '../../../../../core/services/selected-mail.service';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { MailFilterBarComponent } from '../../molecules/mail-filter-bar/mail-filter-bar.component';
import { MailPreviewComponent, ContextMenuEvent } from '../../molecules/mail-preview/mail-preview.component';
import { ContextMenuComponent } from '../../molecules/context-menu/context-menu.component';
import { TagFilterBarComponent } from '../../atoms/tag-filter-bar/tag-filter-bar.component';
import { MailSkeletonComponent } from '../../atoms/mail-skeleton/mail-skeleton.component';
import { GraphSelectionInfo } from '../../../types/graph-selection-info.type';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ContextMenuState } from '../../../types/context-menu-state.type';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [
    MailFilterBarComponent,
    MailPreviewComponent,
    ContextMenuComponent,
    TagFilterBarComponent,
    IconComponent,
    MailSkeletonComponent,
  ],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.scss',
})
export class MailListComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  private _mailService: MockMailService = inject(MockMailService);
  private _selectedMailService: SelectedMailService = inject(SelectedMailService);
  private _highlightService: HighlightService = inject(HighlightService);
  private _elementRef: ElementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      // Track only the filter/sort/graph context — not individual mail read-status changes.
      // Using untracked() prevents a mail being marked as read mid-navigation from
      // invalidating the navigation list and breaking arrow-key traversal in filtered views.
      this.$activeFilter();
      this.$sortDirection();
      this.$graphSelectionMails();
      this._selectedMailService.setMailList(untracked(() => this.$filteredMails()));
    });

    effect(() => {
      const selectedMail: Mail | null = this._selectedMailService.selectedMail();
      if (!selectedMail) {
        return;
      }
      const el: HTMLElement | null = this._elementRef.nativeElement.querySelector(
        `[data-mail-filename="${selectedMail.filename}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    this._initMockHighlights();
  }

  private _initMockHighlights(): void {
    this._highlightService.setSearchTerms([
      'Budget',
      'David',
      'Project',
      'Alpha',
      'Rachel',
      'HR',
      'Review',
      'Incident',
      'Dashboard',
      'Hila',
      'Michal',
    ]);

    this._highlightService.setMailHighlight('mail-001', {
      searchTerms: ['Budget', 'David'],
      bodyWords: ['meeting', 'quarterly', 'finance'],
      attachmentContents: ['budget.xlsx'],
      attachmentNames: ['presentation-final-v3-approved-by-finance-committee-jan-2024.pptx'],
    });

    this._highlightService.setMailHighlight('mail-003', {
      searchTerms: ['Project', 'Alpha', 'Rachel'],
      bodyWords: ['status', 'update', 'deadline'],
      attachmentContents: ['status-report.pdf'],
      attachmentNames: [],
    });

    this._highlightService.setMailHighlight('mail-005', {
      searchTerms: ['HR', 'Review'],
      bodyWords: ['interview', 'candidate', 'feedback'],
      attachmentContents: ['cv.docx', 'scoring.xlsx'],
      attachmentNames: ['candidate-review-technical-and-soft-skills-evaluation-extended-version.docx'],
    });

    this._highlightService.setMailHighlight('mail-009', {
      searchTerms: ['Incident'],
      bodyWords: ['production', 'downtime', 'resolved', 'incident', 'hila'],
      attachmentContents: [
        'incident-report.pdf',
        'wmi-provider-host-dump.log',
        'cpu-usage-spike-graph-2024hila-01-16.png',
      ],
      attachmentNames: ['cpu-usage-spike-graph-2024hila-01-16.png'],
    });

    this._highlightService.setMailHighlight('mail-014', {
      searchTerms: ['Dashboard', 'Review'],
      bodyWords: ['design', 'revamp', 'responsive'],
      attachmentContents: [],
      attachmentNames: ['dashboard-layout-v2-dark-mode-mobile-desktop-responsive.fig'],
    });
  }

  public $activeFilter: WritableSignal<MailFilter> = signal<MailFilter>('all');
  public $sortDirection: WritableSignal<SortDirection> = signal<SortDirection>('desc');
  public $isSelectMode: WritableSignal<boolean> = signal<boolean>(false);
  private _$selectedMails: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  private _$selectedMailId: WritableSignal<string | null> = signal<string | null>(null);
  public $contextMenu: WritableSignal<ContextMenuState> = signal<ContextMenuState>({ isOpen: false, x: 0, y: 0, mail: null });

  private _lastSelectedIndex: number | null = null;
  private _previouslySelectedMail: Mail | null = null;

  public $graphSelectionMails: InputSignal<Mail[] | null> = input<Mail[] | null>(null, { alias: 'graphSelectionMails' });
  public $graphSelectionInfo: InputSignal<GraphSelectionInfo | null> = input<GraphSelectionInfo | null>(null, {
    alias: 'graphSelectionInfo',
  });
  public $showTagFilter: InputSignal<boolean> = input<boolean>(false, { alias: 'showTagFilter' });
  public $isFullscreen: InputSignal<boolean> = input<boolean>(false, { alias: 'isFullscreen' });
  public $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });
  public closeClick: OutputEmitterRef<void> = output<void>();
  public fullscreenClick: OutputEmitterRef<void> = output<void>();

  public readonly inboxTranslations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  private _$allMails: Signal<Mail[]> = computed<Mail[]>(() => this.$graphSelectionMails() ?? this._mailService.mails());

  public $filteredMails: Signal<Mail[]> = computed<Mail[]>(() => {
    const filter: MailFilter = this.$activeFilter();
    const mails: Mail[] = this._$allMails();
    const sortDirection: SortDirection = this.$sortDirection();

    const filtered: Mail[] = (() => {
      switch (filter) {
        case 'read':
          return mails.filter((mail: Mail) => mail.isRead);
        case 'unread':
          return mails.filter((mail: Mail) => !mail.isRead);
        default:
          return mails;
      }
    })();

    return [...filtered].sort((a: Mail, b: Mail) => {
      const dateA: number = new Date(a.sent).getTime();
      const dateB: number = new Date(b.sent).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  });

  public $selectedCount: Signal<number> = computed<number>(() => this._$selectedMails().size);

  public onFilterChange(filter: MailFilter): void {
    if (this.$activeFilter() === filter) {
      this.$activeFilter.set('all');
    } else {
      this.$activeFilter.set(filter);
    }
  }

  public onSortChange(direction: SortDirection): void {
    this.$sortDirection.set(direction);
  }

  public onTranslateClick(language: Language): void {
    // TODO: connect to real service / NgRx action
    console.log('Translation language selected:', language);
  }

  public onExportModeToggle(): void {
    this.$isSelectMode.update((value: boolean) => !value);
    if (!this.$isSelectMode()) {
      this._$selectedMails.set(new Set());
      this._lastSelectedIndex = null;
    }
  }

  public onExportClick(): void {
    const selectedMailIds: string[] = Array.from(this._$selectedMails());
    const selectedMailsData: Mail[] = this._$allMails().filter((mail: Mail) => selectedMailIds.includes(mail.filename));
    console.log('Exporting mails to Excel:', selectedMailsData);
    this.exportToExcel(selectedMailsData);
  }

  public exportToExcel(mails: Mail[]): void {
    const headers: string[] = ['Subject', 'From', 'To', 'Date', 'Tag'];
    const rows: string[][] = mails.map((mail: Mail) => [
      mail.subject,
      mail.from.username || mail.from.mail || '',
      mail.to.map((recipient: { username?: string; mail?: string }) => recipient.username || recipient.mail || '').join('; '),
      new Date(mail.sent).toISOString(),
      mail.tag,
    ]);

    const csvContent: string = [headers, ...rows]
      .map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
      .join('\n');

    const blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link: HTMLAnchorElement = document.createElement('a');
    const url: string = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mails_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public onMailClick(mail: Mail): void {
    if (this._previouslySelectedMail && this._previouslySelectedMail.filename !== mail.filename) {
      this._selectedMailService.markMailAsRead(this._previouslySelectedMail);
    }
    this._previouslySelectedMail = mail;
    this._$selectedMailId.set(mail.filename);
    this._selectedMailService.setSelectedMail(mail);
  }

  public onSelectionChange(mail: Mail, event: { shiftKey: boolean }, index: number): void {
    if (event.shiftKey && this._lastSelectedIndex !== null) {
      const mails: Mail[] = this.$filteredMails();
      const start: number = Math.min(this._lastSelectedIndex, index);
      const end: number = Math.max(this._lastSelectedIndex, index);
      this._$selectedMails.update((selected: Set<string>) => {
        const newSelected: Set<string> = new Set(selected);
        mails.slice(start, end + 1).forEach((mail: Mail) => {
          newSelected.add(mail.filename);
        });
        return newSelected;
      });
    } else {
      this._$selectedMails.update((selected: Set<string>) => {
        const newSelected: Set<string> = new Set(selected);
        if (newSelected.has(mail.filename)) {
          newSelected.delete(mail.filename);
        } else {
          newSelected.add(mail.filename);
        }
        return newSelected;
      });
    }
    this._lastSelectedIndex = index;
  }

  public onContextMenu(event: ContextMenuEvent): void {
    this.$contextMenu.set({
      isOpen: true,
      x: event.x,
      y: event.y,
      mail: event.mail,
    });
  }

  public onCloseContextMenu(): void {
    this.$contextMenu.set({ isOpen: false, x: 0, y: 0, mail: null });
  }

  public onMarkAsUnread(): void {
    const mail: Mail | null = this.$contextMenu().mail;
    if (mail) {
      this._selectedMailService.markMailAsUnread(mail);
    }
    this.onCloseContextMenu();
  }

  public isMailSelected(mail: Mail): boolean {
    return this._$selectedMails().has(mail.filename);
  }

  public isCurrentMail(mail: Mail): boolean {
    const selectedMail: Mail | null = this._selectedMailService.selectedMail();
    return selectedMail?.filename === mail.filename;
  }

  public trackByMail(index: number, mail: Mail): string {
    return mail.filename;
  }
}
