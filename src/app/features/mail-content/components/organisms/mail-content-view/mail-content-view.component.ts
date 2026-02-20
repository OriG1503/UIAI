import {
  Component,
  input,
  computed,
  inject,
  signal,
  effect,
  ElementRef,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { Encoding } from '../../../types/encoding.type';
import { MockMailContentService } from '../../../../../core/services/mock-mail-content.service';
import { MailContentToolbarComponent } from '../../molecules/mail-content-toolbar/mail-content-toolbar.component';
import { MailMetadataComponent } from '../../molecules/mail-metadata/mail-metadata.component';
import { MailAttachmentsComponent } from '../../molecules/mail-attachments/mail-attachments.component';
import { MailBodyComponent } from '../../molecules/mail-body/mail-body.component';
import { ContentSkeletonComponent } from '../../atoms/content-skeleton/content-skeleton.component';

@Component({
  selector: 'app-mail-content-view',
  standalone: true,
  imports: [
    MailContentToolbarComponent,
    MailMetadataComponent,
    MailAttachmentsComponent,
    MailBodyComponent,
    ContentSkeletonComponent,
  ],
  templateUrl: './mail-content-view.component.html',
  styleUrl: './mail-content-view.component.scss',
})
export class MailContentViewComponent {
  private _mailContentService: MockMailContentService = inject(MockMailContentService);
  private _elementRef: ElementRef = inject(ElementRef);

  $mail: InputSignal<Mail | null> = input<Mail | null>(null, { alias: 'mail' });
  $isLoading: InputSignal<boolean> = input<boolean>(false, { alias: 'isLoading' });

  $selectedEncoding: WritableSignal<Encoding> = signal<Encoding>('none');
  $currentHighlightIndex: WritableSignal<number> = signal<number>(0);
  $totalHighlights: WritableSignal<number> = signal<number>(0);

  readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  $hasAttachments: Signal<boolean> = computed<boolean>(() => {
    const mail: Mail | null = this.$mail();
    return mail !== null && mail.attachments?.filename?.length > 0;
  });

  $attachments: Signal<string[]> = computed<string[]>(() => {
    const mail: Mail | null = this.$mail();
    return mail?.attachments?.filename ?? [];
  });

  $mailContent: Signal<string> = computed<string>(() => {
    const mail: Mail | null = this.$mail();
    if (!mail) {
      return '';
    }
    return this._mailContentService.getMailContent(mail.filename);
  });

  $mailFilename: Signal<string> = computed<string>(() => this.$mail()?.filename ?? '');

  constructor() {
    effect(() => {
      this.$mailFilename();
      setTimeout(() => {
        const marks: HTMLElement[] = this._getNavigableMarks();
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
    const mail: Mail | null = this.$mail();
    if (mail) {
      // TODO: connect to real service / NgRx action
      console.log('Downloading mail:', mail.subject);
    }
  }

  public onDownloadAllAttachments(): void {
    const attachments: string[] = this.$attachments();
    // TODO: connect to real service / NgRx action
    console.log('Downloading all attachments:', attachments);
  }

  public onDownloadAttachment(filename: string): void {
    // TODO: connect to real service / NgRx action
    console.log('Downloading attachment:', filename);
  }

  public onPreviousHighlight(): void {
    const total: number = this.$totalHighlights();
    if (total === 0) {
      return;
    }
    const currentIndex: number = this.$currentHighlightIndex();
    const newIndex: number = currentIndex > 0 ? currentIndex - 1 : total - 1;
    this.$currentHighlightIndex.set(newIndex);
    this._scrollToHighlight(newIndex);
  }

  public onNextHighlight(): void {
    const total: number = this.$totalHighlights();
    if (total === 0) {
      return;
    }
    const currentIndex: number = this.$currentHighlightIndex();
    const newIndex: number = currentIndex < total - 1 ? currentIndex + 1 : 0;
    this.$currentHighlightIndex.set(newIndex);
    this._scrollToHighlight(newIndex);
  }

  private _getNavigableMarks(): HTMLElement[] {
    const el: HTMLElement = this._elementRef.nativeElement;
    const allMarks: HTMLElement[] = Array.from(el.querySelectorAll('mark.search-highlight, .ellipsis.highlighted'));
    return allMarks.filter((mark: HTMLElement) => !mark.closest('.attachment-tooltip'));
  }

  private _scrollToHighlight(index: number): void {
    const marks: HTMLElement[] = this._getNavigableMarks();
    if (marks.length === 0 || index >= marks.length) {
      return;
    }

    marks.forEach((mark: HTMLElement) => mark.classList.remove('highlight-glow'));

    const targetMark: HTMLElement = marks[index];
    void targetMark.offsetWidth;
    targetMark.classList.add('highlight-glow');
    targetMark.scrollIntoView({ behavior: 'smooth', block: 'center' });

    targetMark.addEventListener(
      'animationend',
      () => {
        targetMark.classList.remove('highlight-glow');
      },
      { once: true },
    );
  }
}
