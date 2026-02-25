import { Component, input, output, OutputEmitterRef, computed, inject, InputSignal, Signal } from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { ICON_NAMES, IconName } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_LG } from '../../../../../shared/consts/icon-size.consts';
import { ATTACHMENT_NAME_MAX_LENGTH, EXTENSION_COLORS, EXTENSION_ICONS } from '../../../consts/mail-attachments.consts';
import { MAIL_ATTACHMENTS_LABEL_MAP } from '../../../mapping/mail-content.label-map';

@Component({
  selector: 'app-mail-attachments',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe],
  templateUrl: './mail-attachments.component.html',
  styleUrl: './mail-attachments.component.scss',
})
export class MailAttachmentsComponent {
  private _highlightService: HighlightService = inject(HighlightService);

  public $attachments: InputSignal<string[]> = input.required<string[]>({ alias: 'attachments' });
  public $mailFilename: InputSignal<string> = input<string>('', { alias: 'mailFilename' });
  public downloadAllClick: OutputEmitterRef<void> = output<void>();
  public downloadAttachmentClick: OutputEmitterRef<string> = output<string>();

  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_LG = ICON_SIZE_LG;
  public readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;
  public readonly attachmentTranslations: typeof MAIL_ATTACHMENTS_LABEL_MAP = MAIL_ATTACHMENTS_LABEL_MAP;

  public $attachmentCount: Signal<number> = computed<number>(() => this.$attachments().length);
  public $searchTerms: Signal<string[]> = computed<string[]>(() => this._highlightService.$searchTerms());

  public isAttachmentContentHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentContentHighlighted(this.$mailFilename(), attachmentName);
  }

  public isAttachmentNameHighlighted(attachmentName: string): boolean {
    return this._highlightService.isAttachmentNameHighlighted(this.$mailFilename(), attachmentName);
  }

  public getExtensionColor(filename: string): string {
    const ext: string = filename.split('.').pop()?.toLowerCase() ?? '';
    return EXTENSION_COLORS[ext] ?? EXTENSION_COLORS['default'];
  }

  public getExtensionIcon(filename: string): IconName {
    const ext: string = filename.split('.').pop()?.toLowerCase() ?? '';
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
    const terms: string[] = this.$searchTerms();
    if (terms.length === 0) {
      return false;
    }
    const lowerFilename: string = filename.toLowerCase();
    return terms.some((term: string) => {
      const lowerTerm: string = term.toLowerCase();
      const searchZone: string = lowerFilename.substring(
        Math.max(0, ATTACHMENT_NAME_MAX_LENGTH - lowerTerm.length + 1),
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
