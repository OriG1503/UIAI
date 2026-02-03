import { Component, input, computed, inject } from '@angular/core';
import { Mail } from '../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../shared/types/mail-user-info.type';
import { INBOX_TRANSLATIONS } from '../../../../shared/translations/inbox.translations';
import { HighlightTextPipe } from '../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../core/services/highlight.service';

@Component({
  selector: 'app-mail-metadata',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-metadata.component.html',
  styleUrl: './mail-metadata.component.scss',
})
export class MailMetadataComponent {
  private _highlightService = inject(HighlightService);

  $mail = input.required<Mail>({ alias: 'mail' });

  readonly translations = INBOX_TRANSLATIONS;

  $searchTerms = computed(() => this._highlightService.$searchTerms());

  $formattedDate = computed(() => {
    const mail = this.$mail();
    const date = new Date(mail.sent);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  });

  $formattedTime = computed(() => {
    const mail = this.$mail();
    const date = new Date(mail.sent);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  $fromDisplay = computed(() => {
    return this._formatUserInfo(this.$mail().from);
  });

  $toDisplay = computed(() => {
    return this.$mail().to.map((user) => this._formatUserInfo(user)).join(', ');
  });

  $ccDisplay = computed(() => {
    const cc = this.$mail().cc;
    if (!cc || cc.length === 0) {
      return '';
    }
    return cc.map((user) => this._formatUserInfo(user)).join(', ');
  });

  $bccDisplay = computed(() => {
    const bcc = this.$mail().bcc;
    if (!bcc || bcc.length === 0) {
      return '';
    }
    return bcc.map((user) => this._formatUserInfo(user)).join(', ');
  });

  private _formatUserInfo(user: MailUserInfo): string {
    if (user.username && user.mail) {
      return `${user.username} <${user.mail}>`;
    }
    if (user.username) {
      return user.username;
    }
    if (user.mail) {
      return user.mail;
    }
    return user.tag ?? '';
  }
}
