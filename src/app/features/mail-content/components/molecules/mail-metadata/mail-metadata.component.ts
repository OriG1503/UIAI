import { Component, input, computed, inject, InputSignal, Signal } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../../shared/types/mail-user-info.type';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-mail-metadata',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-metadata.component.html',
  styleUrl: './mail-metadata.component.scss',
})
export class MailMetadataComponent {
  private _highlightService: HighlightService = inject(HighlightService);

  $mail: InputSignal<Mail> = input.required<Mail>({ alias: 'mail' });

  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  $searchTerms: Signal<string[]> = computed<string[]>(() => this._highlightService.$searchTerms());

  $formattedDate: Signal<string> = computed<string>(() => {
    const mail: Mail = this.$mail();
    const date: Date = new Date(mail.sent);
    const day: string = date.getDate().toString().padStart(2, '0');
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const year: number = date.getFullYear();
    return `${day}/${month}/${year}`;
  });

  $formattedTime: Signal<string> = computed<string>(() => {
    const mail: Mail = this.$mail();
    const date: Date = new Date(mail.sent);
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  $fromDisplay: Signal<string> = computed<string>(() => {
    return this._formatUserInfo(this.$mail().from);
  });

  $toDisplay: Signal<string> = computed<string>(() => {
    return this.$mail()
      .to.map((user: MailUserInfo) => this._formatUserInfo(user))
      .join(', ');
  });

  $ccDisplay: Signal<string> = computed<string>(() => {
    const cc: MailUserInfo[] | undefined = this.$mail().cc;
    if (!cc || cc.length === 0) {
      return '';
    }
    return cc.map((user: MailUserInfo) => this._formatUserInfo(user)).join(', ');
  });

  $bccDisplay: Signal<string> = computed<string>(() => {
    const bcc: MailUserInfo[] | undefined = this.$mail().bcc;
    if (!bcc || bcc.length === 0) {
      return '';
    }
    return bcc.map((user: MailUserInfo) => this._formatUserInfo(user)).join(', ');
  });

  private _formatUserInfo(user: MailUserInfo): string {
    if (user.mail) {
      return user.mail;
    }
    return user.tag ?? '';
  }
}
