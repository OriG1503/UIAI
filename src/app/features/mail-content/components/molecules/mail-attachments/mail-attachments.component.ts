import { Component, input, output, OutputEmitterRef, computed, inject } from '@angular/core';
import { INBOX_LABEL_MAPPING } from '../../../../../shared/mapping/inbox.label-map';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { ICON_NAMES, IconName } from '../../../../../shared/constants/icon-name.constants';
import { ATTACHMENT_NAME_MAX_LENGTH } from '../../../constants/mail-attachments.constants';

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
  downloadAllClick: OutputEmitterRef<void> = output<void>();
  downloadAttachmentClick: OutputEmitterRef<string> = output<string>();

  readonly ICON_NAMES = ICON_NAMES;
  readonly translations = INBOX_LABEL_MAPPING;

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

  public getDisplayName(filename: string): string {
    if (filename.length <= ATTACHMENT_NAME_MAX_LENGTH) {
      return filename;
    }
    return filename.substring(0, ATTACHMENT_NAME_MAX_LENGTH);
  }

  public isNameOverflow(filename: string): boolean {
    return filename.length > ATTACHMENT_NAME_MAX_LENGTH;
  }

  public isEllipsisHighlighted(filename: string): boolean {
    if (!this.isNameOverflow(filename)) {
      return false;
    }
    const terms = this.$searchTerms();
    if (terms.length === 0) {
      return false;
    }
    const lowerFilename = filename.toLowerCase();
    return terms.some((term) => {
      const lowerTerm = term.toLowerCase();
      const searchZone = lowerFilename.substring(
        Math.max(0, ATTACHMENT_NAME_MAX_LENGTH - lowerTerm.length + 1)
      );
      return searchZone.includes(lowerTerm);
    });
  }

  public onDownloadAllClick(): void {
    this.downloadAllClick.emit();
  }

  public onAttachmentClick(filename: string): void {
    this.downloadAttachmentClick.emit(filename);
  }
}
