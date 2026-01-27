import { Component, input, output, computed, inject } from '@angular/core';
import { INBOX_TRANSLATIONS, HighlightTextPipe } from '../../../../shared';
import { IconComponent } from '../../../../shared/atoms';
import { HighlightService } from '../../../../core/services';

const EXTENSION_COLORS: Record<string, string> = {
  docx: '#2f67bf',
  doc: '#2f67bf',
  xlsx: '#219a58',
  xls: '#219a58',
  png: '#01caff',
  jpg: '#01caff',
  jpeg: '#01caff',
  gif: '#01caff',
  pdf: '#ea355a',
  pptx: '#d35230',
  ppt: '#d35230',
  txt: '#6b7280',
  zip: '#f59e0b',
  default: '#9ca3af'
};

const EXTENSION_ICONS: Record<string, string> = {
  docx: 'file-word',
  doc: 'file-word',
  xlsx: 'file-excel',
  xls: 'file-excel',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  pdf: 'file-pdf',
  pptx: 'file',
  ppt: 'file',
  txt: 'file',
  zip: 'file',
  default: 'file'
};

@Component({
  selector: 'app-mail-attachments',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-attachments.component.html',
  styleUrl: './mail-attachments.component.scss',
})
export class MailAttachmentsComponent {
  private _highlightService = inject(HighlightService);

  $attachments = input.required<string[]>({ alias: 'attachments' });
  $mailFilename = input<string>('', { alias: 'mailFilename' });
  downloadAllClick = output<void>();
  downloadAttachmentClick = output<string>();

  readonly translations = INBOX_TRANSLATIONS;

  $attachmentCount = computed(() => this.$attachments().length);
  $searchTerms = computed(() => this._highlightService.$searchTerms());

  isAttachmentContentHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentContentHighlighted(
      this.$mailFilename(),
      attachmentName
    );
  }

  isAttachmentNameHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentNameHighlighted(
      this.$mailFilename(),
      attachmentName
    );
  }

  getExtensionColor(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_COLORS[ext] ?? EXTENSION_COLORS['default'];
  }

  getExtensionIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_ICONS[ext] ?? EXTENSION_ICONS['default'];
  }

  onDownloadAllClick(): void {
    this.downloadAllClick.emit();
  }

  onAttachmentClick(filename: string): void {
    this.downloadAttachmentClick.emit(filename);
  }
}
