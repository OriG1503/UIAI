import { Component, input, output, OutputEmitterRef, computed, inject, InputSignal, Signal } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../../shared/types/mail-user-info.type';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { MockMailContentService } from '../../../../../core/services/mock-mail-content.service';
import { HighlightData } from '../../../../../shared/types/highlight-match.type';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import {
  MAIL_PREVIEW_SUBJECT_MAX_LENGTH,
  MAIL_PREVIEW_TO_MAX_COUNT,
  MAIL_PREVIEW_TO_MAX_LENGTH,
  MAIL_PREVIEW_CONTENT_MAX_LENGTH,
} from '../../../consts/mail-preview.consts';

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
  private _highlightService: HighlightService = inject(HighlightService);
  private _mailContentService: MockMailContentService = inject(MockMailContentService);

  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  $mail: InputSignal<Mail> = input.required<Mail>({ alias: 'mail' });
  $isSelectMode: InputSignal<boolean> = input<boolean>(false, { alias: 'isSelectMode' });
  $isSelected: InputSignal<boolean> = input<boolean>(false, { alias: 'isSelected' });
  $isCurrent: InputSignal<boolean> = input<boolean>(false, { alias: 'isCurrent' });
  mailClick: OutputEmitterRef<void> = output<void>();
  selectionChange: OutputEmitterRef<{ shiftKey: boolean }> = output<{ shiftKey: boolean }>();
  contextMenu: OutputEmitterRef<ContextMenuEvent> = output<ContextMenuEvent>();

  $searchTerms: Signal<string[]> = computed<string[]>(() => this._highlightService.$searchTerms());

  $isAttachmentBadgeHighlighted: Signal<boolean> = computed<boolean>(() =>
    this._highlightService.hasAnyAttachmentHighlight(this.$mail().filename),
  );

  $attachmentCount: Signal<number> = computed<number>(() => {
    const mail: Mail = this.$mail();
    return mail.attachments?.filename?.length ?? 0;
  });

  $isUnread: Signal<boolean> = computed<boolean>(() => {
    return !this.$mail().isRead;
  });

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

  $senderDisplay: Signal<string> = computed<string>(() => {
    const from: MailUserInfo = this.$mail().from;
    return this._formatUserInfo(from);
  });

  $subjectPreview: Signal<string> = computed<string>(() => {
    const subject: string = this.$mail().subject;
    if (subject.length <= MAIL_PREVIEW_SUBJECT_MAX_LENGTH) {
      return subject;
    }
    return subject.substring(0, MAIL_PREVIEW_SUBJECT_MAX_LENGTH);
  });

  $isSubjectOverflow: Signal<boolean> = computed<boolean>(() => {
    return this.$mail().subject.length > MAIL_PREVIEW_SUBJECT_MAX_LENGTH;
  });

  $isSubjectEllipsisHighlighted: Signal<boolean> = computed<boolean>(() => {
    if (!this.$isSubjectOverflow()) {
      return false;
    }
    const hiddenPart: string = this.$mail().subject.substring(MAIL_PREVIEW_SUBJECT_MAX_LENGTH);
    return this._containsSearchTerm(hiddenPart, this.$searchTerms());
  });

  private _$toAllFormatted: Signal<string[]> = computed<string[]>(() => {
    return this.$mail().to.map((user: MailUserInfo) => this._formatUserInfo(user));
  });

  private _$toVisibleText: Signal<string> = computed<string>(() => {
    return this._$toAllFormatted().slice(0, MAIL_PREVIEW_TO_MAX_COUNT).join(', ');
  });

  $toDisplayText: Signal<string> = computed<string>(() => {
    const visible: string = this._$toVisibleText();
    if (visible.length <= MAIL_PREVIEW_TO_MAX_LENGTH) {
      return visible;
    }
    return visible.substring(0, MAIL_PREVIEW_TO_MAX_LENGTH);
  });

  $isToOverflow: Signal<boolean> = computed<boolean>(() => {
    return (
      this.$mail().to.length > MAIL_PREVIEW_TO_MAX_COUNT || this._$toVisibleText().length > MAIL_PREVIEW_TO_MAX_LENGTH
    );
  });

  $isToEllipsisHighlighted: Signal<boolean> = computed<boolean>(() => {
    if (!this.$isToOverflow()) {
      return false;
    }
    const allFormatted: string[] = this._$toAllFormatted();
    const hiddenAddresses: string = allFormatted.slice(MAIL_PREVIEW_TO_MAX_COUNT).join(' ');
    const visibleText: string = this._$toVisibleText();
    const hiddenChars: string =
      visibleText.length > MAIL_PREVIEW_TO_MAX_LENGTH ? visibleText.substring(MAIL_PREVIEW_TO_MAX_LENGTH) : '';
    const hiddenText: string = [hiddenChars, hiddenAddresses].filter((part: string) => part.length > 0).join(' ');
    return this._containsSearchTerm(hiddenText, this.$searchTerms());
  });

  $contentPreview: Signal<string> = computed<string>(() => {
    const mail: Mail = this.$mail();
    const html: string = this._mailContentService.getMailContent(mail.filename);
    const div: HTMLDivElement = document.createElement('div');
    div.innerHTML = html;
    const fullText: string = (div.textContent || '').replace(/\s+/g, ' ').trim();

    if (!fullText) {
      return '';
    }

    const searchTerms: string[] = this.$searchTerms();
    const highlightData: HighlightData | undefined = this._highlightService.getMailHighlight(mail.filename);
    const bodyWords: string[] = highlightData?.bodyWords ?? [];
    const allTerms: string[] = [...new Set([...searchTerms, ...bodyWords])];

    if (allTerms.length > 0) {
      const lowerText: string = fullText.toLowerCase();
      const matchIndex: number = allTerms.reduce((earliest: number, term: string) => {
        const idx: number = lowerText.indexOf(term.toLowerCase());
        if (idx === -1) {
          return earliest;
        }
        return earliest === -1 ? idx : Math.min(earliest, idx);
      }, -1);

      if (matchIndex !== -1) {
        const start: number = Math.max(0, matchIndex - Math.floor(MAIL_PREVIEW_CONTENT_MAX_LENGTH / 4));
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
    return terms.some((term: string) => text.toLowerCase().includes(term.toLowerCase()));
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
      y: event.clientY,
    });
  }
}
