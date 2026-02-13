import { Component, signal, computed, inject, effect, input } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { Language } from '../../../types/language.type';
import { MailFilter } from '../../../types/mail-filter.type';
import { SortDirection } from '../../../../../shared/types/sort-direction.type';
import { MockMailService } from '../../../../../core/services/mock-mail.service';
import { SelectedMailService } from '../../../../../core/services/selected-mail.service';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { UserMailBubbleComponent } from '../../molecules/user-mail-bubble/user-mail-bubble.component';
import { MailFilterBarComponent } from '../../molecules/mail-filter-bar/mail-filter-bar.component';
import { MailItemComponent, ContextMenuEvent } from '../../molecules/mail-item/mail-item.component';
import { ContextMenuComponent } from '../../molecules/context-menu/context-menu.component';
import { TagFilterBarComponent } from '../../atoms/tag-filter-bar/tag-filter-bar.component';
import { GraphSelectionInfo } from '../../../types/graph-selection-info.type';
import { INBOX_TRANSLATIONS } from '../../../../../shared/translations/inbox.translations';

type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  mail: Mail | null;
};

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [UserMailBubbleComponent, MailFilterBarComponent, MailItemComponent, ContextMenuComponent, TagFilterBarComponent],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.scss',
})
export class MailListComponent {
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
      bodyWords: ['production', 'downtime', 'resolved'],
      attachmentContents: ['incident-report.pdf', 'wmi-provider-host-dump.log'],
      attachmentNames: ['cpu-usage-spike-graph-2024-01-16.png'],
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

  $graphSelectionMails = input<Mail[] | null>(null, { alias: 'graphSelectionMails' });
  $graphSelectionInfo = input<GraphSelectionInfo | null>(null, { alias: 'graphSelectionInfo' });
  $showTagFilter = input<boolean>(false, { alias: 'showTagFilter' });

  readonly userEmail = this._mailService.userEmail;
  readonly inboxTranslations = INBOX_TRANSLATIONS;

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
        case 'starred':
          return mails.filter((mail) => this._mailService.isStarred(mail.filename));
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

  $mailCount = computed(() => this.$allMails().length);

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
    }
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

  public onStarClick(mail: Mail): void {
    this._mailService.toggleStarred(mail.filename);
  }

  public onMailClick(mail: Mail): void {
    this._selectedMailService.markMailAsSeen(mail);
    this.$selectedMailId.set(mail.filename);
    this._selectedMailService.setSelectedMail(mail);
  }

  public onSelectionChange(mail: Mail): void {
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

  public isMailStarred(mail: Mail): boolean {
    return this._mailService.isStarred(mail.filename);
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
