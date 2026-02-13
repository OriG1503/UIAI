import { Component, input, output, computed, inject } from '@angular/core';
import { INBOX_TRANSLATIONS } from '../../../../../shared/translations/inbox.translations';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { ICON_NAMES, IconName } from '../../../../../shared/constants/icon-name.constants';

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

const EXTENSION_ICONS: Record<string, IconName> = {
  docx: ICON_NAMES.FILE_WORD,
  doc: ICON_NAMES.FILE_WORD,
  xlsx: ICON_NAMES.FILE_EXCEL,
  xls: ICON_NAMES.FILE_EXCEL,
  png: ICON_NAMES.IMAGE,
  jpg: ICON_NAMES.IMAGE,
  jpeg: ICON_NAMES.IMAGE,
  gif: ICON_NAMES.IMAGE,
  pdf: ICON_NAMES.FILE_PDF,
  pptx: ICON_NAMES.FILE,
  ppt: ICON_NAMES.FILE,
  txt: ICON_NAMES.FILE,
  zip: ICON_NAMES.FILE,
  default: ICON_NAMES.FILE
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

  readonly ICON_NAMES = ICON_NAMES;
  readonly translations = INBOX_TRANSLATIONS;

  $attachmentCount = computed(() => this.$attachments().length);
  $searchTerms = computed(() => this._highlightService.$searchTerms());

  public isAttachmentContentHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentContentHighlighted(
      this.$mailFilename(),
      attachmentName
    );
  }

  public isAttachmentNameHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentNameHighlighted(
      this.$mailFilename(),
      attachmentName
    );
  }

  public getExtensionColor(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_COLORS[ext] ?? EXTENSION_COLORS['default'];
  }

  public getExtensionIcon(filename: string): IconName {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_ICONS[ext] ?? EXTENSION_ICONS['default'];
  }

  public onDownloadAllClick(): void {
    this.downloadAllClick.emit();
  }

  public onAttachmentClick(filename: string): void {
    this.downloadAttachmentClick.emit(filename);
  }
}
