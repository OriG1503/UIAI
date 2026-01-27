import { Component, signal, computed, inject } from '@angular/core';
import { MailFilter, Mail } from '../../../../shared';
import { MockMailService } from '../../../../core/services/mock-mail.service';
import { UserMailBubbleComponent } from '../../molecules/user-mail-bubble/user-mail-bubble.component';
import { MailFilterBarComponent } from '../../molecules/mail-filter-bar/mail-filter-bar.component';
import { MailItemComponent } from '../../molecules/mail-item/mail-item.component';

@Component({
  selector: 'app-mail-list',
  standalone: true,
  imports: [UserMailBubbleComponent, MailFilterBarComponent, MailItemComponent],
  templateUrl: './mail-list.component.html',
  styleUrl: './mail-list.component.scss',
})
export class MailListComponent {
  private _mailService = inject(MockMailService);

  $activeFilter = signal<MailFilter>('all');

  readonly userEmail = this._mailService.userEmail;

  $allMails = computed(() => this._mailService.mails());

  $filteredMails = computed(() => {
    const filter = this.$activeFilter();
    const mails = this.$allMails();

    switch (filter) {
      case 'read':
        return mails.filter((mail) => mail.seen);
      case 'unread':
        return mails.filter((mail) => !mail.seen);
      default:
        return mails;
    }
  });

  $mailCount = computed(() => this.$allMails().length);

  onFilterChange(filter: MailFilter): void {
    this.$activeFilter.set(filter);
  }

  onStarClick(mail: Mail): void {
    this._mailService.toggleStarred(mail.filename);
  }

  onMailClick(mail: Mail): void {
    this._mailService.markAsRead(mail.filename);
    console.log('Mail clicked:', mail.subject);
  }

  isMailStarred(mail: Mail): boolean {
    return this._mailService.isStarred(mail.filename);
  }

  trackByMail(index: number, mail: Mail): string {
    return mail.filename;
  }
}
