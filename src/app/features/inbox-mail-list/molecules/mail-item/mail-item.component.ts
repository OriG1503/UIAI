import { Component, input, output, computed } from '@angular/core';
import { Mail, MailUserInfo } from '../../../../shared';
import { IconComponent } from '../../../../shared/atoms';

@Component({
  selector: 'app-mail-item',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-item.component.html',
  styleUrl: './mail-item.component.scss',
})
export class MailItemComponent {
  $mail = input.required<Mail>({ alias: 'mail' });
  $isStarred = input<boolean>(false, { alias: 'isStarred' });
  starClick = output<void>();
  mailClick = output<void>();

  $attachmentCount = computed(() => {
    const mail = this.$mail();
    return mail.attachments?.filename?.length ?? 0;
  });

  $isUnread = computed(() => {
    return !this.$mail().seen;
  });

  $preview = computed(() => {
    const mail = this.$mail();
    // For now, return empty - in real app this would come from body content
    return '';
  });

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

  $senderDisplay = computed(() => {
    const from = this.$mail().from;
    return this._formatUserInfo(from);
  });

  $ccBccDisplay = computed(() => {
    const mail = this.$mail();
    const recipients: string[] = [];

    mail.cc?.forEach((user) => {
      recipients.push(this._formatUserInfo(user));
    });

    mail.bcc?.forEach((user) => {
      recipients.push(this._formatUserInfo(user));
    });

    return recipients.join(', ');
  });

  private _formatUserInfo(user: MailUserInfo): string {
    if (user.username) {
      return user.username;
    }
    if (user.mail) {
      return user.mail;
    }
    return user.tag ?? '';
  }

  onStarClick(event: Event): void {
    event.stopPropagation();
    this.starClick.emit();
  }

  onMailClick(): void {
    this.mailClick.emit();
  }
}
