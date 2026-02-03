import { Component, input, computed, inject, signal, output } from '@angular/core';
import { Mail, Encoding, INBOX_TRANSLATIONS } from '../../../../shared';
import { MockMailContentService } from '../../../../core/services/mock-mail-content.service';
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

  $mail = input<Mail | null>(null, { alias: 'mail' });
  $hasPrevious = input<boolean>(false, { alias: 'hasPrevious' });
  $hasNext = input<boolean>(false, { alias: 'hasNext' });

  previousClick = output<void>();
  nextClick = output<void>();

  $selectedEncoding = signal<Encoding>('none');

  readonly translations = INBOX_TRANSLATIONS;

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
    if (!mail) return '';
    return this._mailContentService.getMailContent(mail.filename);
  });

  $mailFilename = computed(() => this.$mail()?.filename ?? '');

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

  public onPreviousMail(): void {
    this.previousClick.emit();
  }

  public onNextMail(): void {
    this.nextClick.emit();
  }
}
