import { Component, signal, computed, inject, effect, input, output } from '@angular/core';
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
import { INBOX_LABEL_MAPPING } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  mail: Mail | null;
};

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [MailFilterBarComponent, MailPreviewComponent, ContextMenuComponent, TagFilterBarComponent, IconComponent, MailSkeletonComponent],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.scss',
})
export class MailListComponent {
  readonly ICON_NAMES = ICON_NAMES;

  private _mailService = inject(MockMailService);
  private _selectedMailService = inject(SelectedMailService);
  private _highlightService = inject(HighlightService);

  constructor() {
    effect(() => {
      this._selectedMailService.setMailList(this.$filteredMails());
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
      "Michal"
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
      attachmentContents: ['incident-report.pdf', 'wmi-provider-host-dump.log', 'cpu-usage-spike-graph-2024hila-01-16.png'],
      attachmentNames: ['cpu-usage-spike-graph-2024hila-01-16.png'],
    });

    this._highlightService.setMailHighlight('mail-014', {
      searchTerms: ['Dashboard', 'Review'],
      bodyWords: ['design', 'revamp', 'responsive'],
      attachmentContents: [],
      attachmentNames: ['dashboard-layout-v2-dark-mode-mobile-desktop-responsive.fig'],
    });
  }

  $activeFilter = signal<MailFilter>('all');
  $sortDirection = signal<SortDirection>('desc');
  $isSelectMode = signal<boolean>(false);
  $selectedMails = signal<Set<string>>(new Set());
  $selectedMailId = signal<string | null>(null);
  $contextMenu = signal<ContextMenuState>({ isOpen: false, x: 0, y: 0, mail: null });

  private _lastSelectedIndex: number | null = null;
  private _previouslySelectedMail: Mail | null = null;

  $graphSelectionMails = input<Mail[] | null>(null, { alias: 'graphSelectionMails' });
  $graphSelectionInfo = input<GraphSelectionInfo | null>(null, { alias: 'graphSelectionInfo' });
  $showTagFilter = input<boolean>(false, { alias: 'showTagFilter' });
  $isFullscreen = input<boolean>(false, { alias: 'isFullscreen' });
  $isLoading = input<boolean>(false, { alias: 'isLoading' });
  closeClick = output<void>();
  fullscreenClick = output<void>();

  readonly inboxTranslations = INBOX_LABEL_MAPPING;

  $allMails = computed(() => this.$graphSelectionMails() ?? this._mailService.mails());

  $filteredMails = computed(() => {
    const filter = this.$activeFilter();
    const mails = this.$allMails();
    const sortDirection = this.$sortDirection();

    const filtered = (() => {
      switch (filter) {
        case 'seen':
          return mails.filter((mail) => mail.seen);
        case 'unseen':
          return mails.filter((mail) => !mail.seen);
        default:
          return mails;
      }
    })();

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.sent).getTime();
      const dateB = new Date(b.sent).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  });

  $selectedCount = computed(() => this.$selectedMails().size);

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
    console.log('Translation language selected:', language);
  }

  public onExportModeToggle(): void {
    this.$isSelectMode.update((value) => !value);
    if (!this.$isSelectMode()) {
      this.$selectedMails.set(new Set());
      this._lastSelectedIndex = null;
    }
  }

  public onCancelSelectMode(): void {
    this.$isSelectMode.set(false);
    this.$selectedMails.set(new Set());
    this._lastSelectedIndex = null;
  }

  public onExportClick(): void {
    const selectedMailIds = Array.from(this.$selectedMails());
    const selectedMailsData = this.$allMails().filter((mail) => selectedMailIds.includes(mail.filename));
    console.log('Exporting mails to Excel:', selectedMailsData);
    this.exportToExcel(selectedMailsData);
  }

  public exportToExcel(mails: Mail[]): void {
    const headers = ['Subject', 'From', 'To', 'Date', 'Tag'];
    const rows = mails.map((mail) => [
      mail.subject,
      mail.from.username || mail.from.mail || '',
      mail.to.map((t) => t.username || t.mail || '').join('; '),
      new Date(mail.sent).toISOString(),
      mail.tag
    ]);

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mails_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public onMailClick(mail: Mail): void {
    if (this._previouslySelectedMail && this._previouslySelectedMail.filename !== mail.filename) {
      this._selectedMailService.markMailAsSeen(this._previouslySelectedMail);
    }
    this._previouslySelectedMail = mail;
    this.$selectedMailId.set(mail.filename);
    this._selectedMailService.setSelectedMail(mail);
  }

  public onSelectionChange(mail: Mail, event: { shiftKey: boolean }, index: number): void {
    if (event.shiftKey && this._lastSelectedIndex !== null) {
      const mails = this.$filteredMails();
      const start = Math.min(this._lastSelectedIndex, index);
      const end = Math.max(this._lastSelectedIndex, index);
      this.$selectedMails.update((selected) => {
        const newSelected = new Set(selected);
        mails.slice(start, end + 1).forEach((m) => {
          newSelected.add(m.filename);
        });
        return newSelected;
      });
    } else {
      this.$selectedMails.update((selected) => {
        const newSelected = new Set(selected);
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
      mail: event.mail
    });
  }

  public onCloseContextMenu(): void {
    this.$contextMenu.set({ isOpen: false, x: 0, y: 0, mail: null });
  }

  public onMarkAsUnseen(): void {
    const mail = this.$contextMenu().mail;
    if (mail) {
      this._selectedMailService.markMailAsUnseen(mail);
    }
    this.onCloseContextMenu();
  }

  public isMailSelected(mail: Mail): boolean {
    return this.$selectedMails().has(mail.filename);
  }

  public isCurrentMail(mail: Mail): boolean {
    const selectedMail = this._selectedMailService.selectedMail();
    return selectedMail?.filename === mail.filename;
  }

  public trackByMail(index: number, mail: Mail): string {
    return mail.filename;
  }
}
