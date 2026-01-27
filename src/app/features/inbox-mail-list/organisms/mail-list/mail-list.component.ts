import { Component, signal, computed, inject, effect } from '@angular/core';
import { Language, MailFilter, SortDirection, Mail } from '../../../../shared';
import { MockMailService } from '../../../../core/services/mock-mail.service';
import { SelectedMailService } from '../../../../core/services/selected-mail.service';
import { UserMailBubbleComponent } from '../../molecules/user-mail-bubble/user-mail-bubble.component';
import { MailFilterBarComponent } from '../../molecules/mail-filter-bar/mail-filter-bar.component';
import { MailItemComponent, ContextMenuEvent } from '../../molecules/mail-item/mail-item.component';
import { ContextMenuComponent } from '../../molecules/context-menu/context-menu.component';

type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  mail: Mail | null;
};

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [UserMailBubbleComponent, MailFilterBarComponent, MailItemComponent, ContextMenuComponent],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.scss',
})
export class MailListComponent {
  private _mailService = inject(MockMailService);
  private _selectedMailService = inject(SelectedMailService);

  constructor() {
    effect(() => {
      this._selectedMailService.setMailList(this.$filteredMails());
    });
  }

  $activeFilter = signal<MailFilter>('all');
  $sortDirection = signal<SortDirection>('desc');
  $isSelectMode = signal<boolean>(false);
  $selectedMails = signal<Set<string>>(new Set());
  $selectedMailId = signal<string | null>(null);
  $contextMenu = signal<ContextMenuState>({ isOpen: false, x: 0, y: 0, mail: null });

  readonly userEmail = this._mailService.userEmail;

  $allMails = computed(() => this._mailService.mails());

  $filteredMails = computed(() => {
    const filter = this.$activeFilter();
    const mails = this.$allMails();
    const sortDirection = this.$sortDirection();

    const filtered = (() => {
      switch (filter) {
        case 'read':
          return mails.filter((mail) => mail.seen);
        case 'unread':
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

  onFilterChange(filter: MailFilter): void {
    if (this.$activeFilter() === filter) {
      this.$activeFilter.set('all');
    } else {
      this.$activeFilter.set(filter);
    }
  }

  onSortChange(direction: SortDirection): void {
    this.$sortDirection.set(direction);
  }

  onTranslateClick(language: Language): void {
    console.log('Translation language selected:', language);
  }

  onExportModeToggle(): void {
    this.$isSelectMode.update((value) => !value);
    if (!this.$isSelectMode()) {
      this.$selectedMails.set(new Set());
    }
  }

  onExportClick(): void {
    const selectedMailIds = Array.from(this.$selectedMails());
    const selectedMailsData = this.$allMails().filter((mail) => selectedMailIds.includes(mail.filename));
    console.log('Exporting mails to Excel:', selectedMailsData);
    this.exportToExcel(selectedMailsData);
  }

  exportToExcel(mails: Mail[]): void {
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

  onStarClick(mail: Mail): void {
    this._mailService.toggleStarred(mail.filename);
  }

  onMailClick(mail: Mail): void {
    this._mailService.markAsRead(mail.filename);
    this.$selectedMailId.set(mail.filename);
    this._selectedMailService.setSelectedMail(mail);
  }

  onSelectionChange(mail: Mail): void {
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

  onContextMenu(event: ContextMenuEvent): void {
    this.$contextMenu.set({
      isOpen: true,
      x: event.x,
      y: event.y,
      mail: event.mail
    });
  }

  onCloseContextMenu(): void {
    this.$contextMenu.set({ isOpen: false, x: 0, y: 0, mail: null });
  }

  onMarkAsUnread(): void {
    const mail = this.$contextMenu().mail;
    if (mail) {
      this._mailService.markAsUnread(mail.filename);
    }
    this.onCloseContextMenu();
  }

  isMailStarred(mail: Mail): boolean {
    return this._mailService.isStarred(mail.filename);
  }

  isMailSelected(mail: Mail): boolean {
    return this.$selectedMails().has(mail.filename);
  }

  isCurrentMail(mail: Mail): boolean {
    const selectedMail = this._selectedMailService.selectedMail();
    return selectedMail?.filename === mail.filename;
  }

  trackByMail(index: number, mail: Mail): string {
    return mail.filename;
  }
}
