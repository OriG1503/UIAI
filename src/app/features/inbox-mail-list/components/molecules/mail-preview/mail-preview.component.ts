import { Component, input, output, OutputEmitterRef, computed, inject } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../../shared/types/mail-user-info.type';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { MockMailContentService } from '../../../../../core/services/mock-mail-content.service';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';
import {
  MAIL_PREVIEW_SUBJECT_MAX_LENGTH,
  MAIL_PREVIEW_TO_MAX_COUNT,
  MAIL_PREVIEW_CONTENT_MAX_LENGTH
} from '../../../constants/mail-preview.constants';

export type ContextMenuEvent = {
  mail: Mail;
  x: number;
  y: number;
};

@Component({
  selector: 'app-mail-preview',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-preview.component.html',
  styleUrl: './mail-preview.component.scss',
})
export class MailPreviewComponent {
  private _highlightService = inject(HighlightService);
  private _mailContentService = inject(MockMailContentService);

  readonly ICON_NAMES = ICON_NAMES;

  $mail = input.required<Mail>({ alias: 'mail' });
  $isSelectMode = input<boolean>(false, { alias: 'isSelectMode' });
  $isSelected = input<boolean>(false, { alias: 'isSelected' });
  $isCurrent = input<boolean>(false, { alias: 'isCurrent' });
  mailClick: OutputEmitterRef<void> = output<void>();
  selectionChange: OutputEmitterRef<{ shiftKey: boolean }> = output<{ shiftKey: boolean }>();
  contextMenu: OutputEmitterRef<ContextMenuEvent> = output<ContextMenuEvent>();

  $searchTerms = computed(() => this._highlightService.$searchTerms());

  $isAttachmentBadgeHighlighted = computed(() =>
    this._highlightService.hasAnyAttachmentHighlight(this.$mail().filename)
  );

  $attachmentCount = computed(() => {
    const mail = this.$mail();
    return mail.attachments?.filename?.length ?? 0;
  });

  $isUnseen = computed(() => {
    return !this.$mail().seen;
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

  $subjectPreview = computed(() => {
    const subject = this.$mail().subject;
    if (subject.length <= MAIL_PREVIEW_SUBJECT_MAX_LENGTH) {
      return subject;
    }
    return subject.substring(0, MAIL_PREVIEW_SUBJECT_MAX_LENGTH);
  });

  $isSubjectOverflow = computed(() => {
    return this.$mail().subject.length > MAIL_PREVIEW_SUBJECT_MAX_LENGTH;
  });

  $isSubjectEllipsisHighlighted = computed(() => {
    if (!this.$isSubjectOverflow()) {
      return false;
    }
    const hiddenPart = this.$mail().subject.substring(MAIL_PREVIEW_SUBJECT_MAX_LENGTH);
    return this._containsSearchTerm(hiddenPart, this.$searchTerms());
  });

  $toDisplayText = computed(() => {
    const to = this.$mail().to;
    return to.slice(0, MAIL_PREVIEW_TO_MAX_COUNT).map((user) => this._formatUserInfo(user)).join(', ');
  });

  $hasMoreTo = computed(() => {
    return this.$mail().to.length > MAIL_PREVIEW_TO_MAX_COUNT;
  });

  $isToEllipsisHighlighted = computed(() => {
    if (!this.$hasMoreTo()) {
      return false;
    }
    const hiddenAddresses = this.$mail().to
      .slice(MAIL_PREVIEW_TO_MAX_COUNT)
      .map((user) => this._formatUserInfo(user));
    const hiddenText = hiddenAddresses.join(' ');
    return this._containsSearchTerm(hiddenText, this.$searchTerms());
  });

  $contentPreview = computed(() => {
    const mail = this.$mail();
    const html = this._mailContentService.getMailContent(mail.filename);
    const div = document.createElement('div');
    div.innerHTML = html;
    const fullText = (div.textContent || '').replace(/\s+/g, ' ').trim();

    if (!fullText) {
      return '';
    }

    const searchTerms = this.$searchTerms();
    const highlightData = this._highlightService.getMailHighlight(mail.filename);
    const bodyWords = highlightData?.bodyWords ?? [];
    const allTerms = [...new Set([...searchTerms, ...bodyWords])];

    if (allTerms.length > 0) {
      const lowerText = fullText.toLowerCase();
      const matchIndex = allTerms.reduce((earliest, term) => {
        const idx = lowerText.indexOf(term.toLowerCase());
        if (idx === -1) {
          return earliest;
        }
        return earliest === -1 ? idx : Math.min(earliest, idx);
      }, -1);

      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - Math.floor(MAIL_PREVIEW_CONTENT_MAX_LENGTH / 4));
        return (start > 0 ? '...' : '') + fullText.substring(start, start + MAIL_PREVIEW_CONTENT_MAX_LENGTH);
      }
    }

    return fullText.substring(0, MAIL_PREVIEW_CONTENT_MAX_LENGTH);
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

  private _containsSearchTerm(text: string, terms: string[]): boolean {
    if (!text || terms.length === 0) {
      return false;
    }
    return terms.some((term) => text.toLowerCase().includes(term.toLowerCase()));
  }

  public onMailClick(event?: MouseEvent): void {
    if (this.$isSelectMode()) {
      this.selectionChange.emit({ shiftKey: event?.shiftKey ?? false });
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
