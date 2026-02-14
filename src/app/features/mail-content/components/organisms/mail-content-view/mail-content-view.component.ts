import { Component, input, computed, inject, signal, effect, ElementRef } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { INBOX_LABEL_MAPPING } from '../../../../../shared/mapping/inbox.label-map';
import { Encoding } from '../../../types/encoding.type';
import { MockMailContentService } from '../../../../../core/services/mock-mail-content.service';
import { MailContentToolbarComponent } from '../../molecules/mail-content-toolbar/mail-content-toolbar.component';
import { MailMetadataComponent } from '../../molecules/mail-metadata/mail-metadata.component';
import { MailAttachmentsComponent } from '../../molecules/mail-attachments/mail-attachments.component';
import { MailBodyComponent } from '../../molecules/mail-body/mail-body.component';

@Component({
  selector: 'app-mail-content-view',
  standalone: true,
  imports: [
    MailContentToolbarComponent,
    MailMetadataComponent,
    MailAttachmentsComponent,
    MailBodyComponent
  ],
  templateUrl: './mail-content-view.component.html',
  styleUrl: './mail-content-view.component.scss',
})
export class MailContentViewComponent {
  private _mailContentService = inject(MockMailContentService);
  private _elementRef = inject(ElementRef);

  $mail = input<Mail | null>(null, { alias: 'mail' });

  $selectedEncoding = signal<Encoding>('none');
  $currentHighlightIndex = signal<number>(0);
  $totalHighlights = signal<number>(0);

  readonly translations = INBOX_LABEL_MAPPING;

  $hasAttachments = computed(() => {
    const mail = this.$mail();
    return mail && mail.attachments?.filename?.length > 0;
  });

  $attachments = computed(() => {
    const mail = this.$mail();
    return mail?.attachments?.filename ?? [];
  });

  $mailContent = computed(() => {
    const mail = this.$mail();
    if (!mail) {
      return '';
    }
    return this._mailContentService.getMailContent(mail.filename);
  });

  $mailFilename = computed(() => this.$mail()?.filename ?? '');

  constructor() {
    effect(() => {
      this.$mailFilename();
      setTimeout(() => {
        const marks = this._getNavigableMarks();
        this.$totalHighlights.set(marks.length);
        this.$currentHighlightIndex.set(0);
        if (marks.length > 0) {
          this._scrollToHighlight(0);
        }
      }, 0);
    });
  }

  public onEncodingChange(encoding: Encoding): void {
    this.$selectedEncoding.set(encoding);
    console.log('Encoding changed to:', encoding);
  }

  public onDownloadMail(): void {
    const mail = this.$mail();
    if (mail) {
      console.log('Downloading mail:', mail.subject);
    }
  }

  public onDownloadAllAttachments(): void {
    const attachments = this.$attachments();
    console.log('Downloading all attachments:', attachments);
  }

  public onDownloadAttachment(filename: string): void {
    console.log('Downloading attachment:', filename);
  }

  public onPreviousHighlight(): void {
    const total = this.$totalHighlights();
    if (total === 0) {
      return;
    }
    const currentIndex = this.$currentHighlightIndex();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : total - 1;
    this.$currentHighlightIndex.set(newIndex);
    this._scrollToHighlight(newIndex);
  }

  public onNextHighlight(): void {
    const total = this.$totalHighlights();
    if (total === 0) {
      return;
    }
    const currentIndex = this.$currentHighlightIndex();
    const newIndex = currentIndex < total - 1 ? currentIndex + 1 : 0;
    this.$currentHighlightIndex.set(newIndex);
    this._scrollToHighlight(newIndex);
  }

  private _getNavigableMarks(): HTMLElement[] {
    const el = this._elementRef.nativeElement;
    const allMarks: HTMLElement[] = Array.from(
      el.querySelectorAll('mark.search-highlight, .ellipsis.highlighted')
    );
    return allMarks.filter((mark) => !mark.closest('.attachment-tooltip'));
  }

  private _scrollToHighlight(index: number): void {
    const marks = this._getNavigableMarks();
    if (marks.length === 0 || index >= marks.length) {
      return;
    }

    marks.forEach((mark) => mark.classList.remove('highlight-glow'));

    const targetMark = marks[index];
    void targetMark.offsetWidth;
    targetMark.classList.add('highlight-glow');
    targetMark.scrollIntoView({ behavior: 'smooth', block: 'center' });

    targetMark.addEventListener('animationend', () => {
      targetMark.classList.remove('highlight-glow');
    }, { once: true });
  }
}
