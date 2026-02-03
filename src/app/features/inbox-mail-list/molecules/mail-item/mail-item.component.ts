import { Component, input, output, computed, inject } from '@angular/core';
import { Mail } from '../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../shared/types/mail-user-info.type';
import { HighlightTextPipe } from '../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../core/services/highlight.service';

export type ContextMenuEvent = {
  mail: Mail;
  x: number;
  y: number;
};

@Component({
  selector: 'app-mail-item',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-item.component.html',
  styleUrl: './mail-item.component.scss',
})
export class MailItemComponent {
  private _highlightService = inject(HighlightService);

  $mail = input.required<Mail>({ alias: 'mail' });
  $isStarred = input<boolean>(false, { alias: 'isStarred' });
  $isSelectMode = input<boolean>(false, { alias: 'isSelectMode' });
  $isSelected = input<boolean>(false, { alias: 'isSelected' });
  $isCurrent = input<boolean>(false, { alias: 'isCurrent' });
  starClick = output<void>();
  mailClick = output<void>();
  selectionChange = output<void>();
  contextMenu = output<ContextMenuEvent>();

  $searchTerms = computed(() => this._highlightService.$searchTerms());

  $isAttachmentBadgeHighlighted = computed(() =>
    this._highlightService.hasAnyAttachmentHighlight(this.$mail().filename)
  );

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

  public onStarClick(event: Event): void {
    event.stopPropagation();
    this.starClick.emit();
  }

  public onMailClick(): void {
    if (this.$isSelectMode()) {
      this.selectionChange.emit();
    } else {
      this.mailClick.emit();
    }
  }

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.emit({
      mail: this.$mail(),
      x: event.clientX,
      y: event.clientY
    });
  }
}
