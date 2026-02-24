import { Component, input, computed, inject, InputSignal, Signal } from '@angular/core';
import { Mail } from '../../../../../shared/types/mail.type';
import { MailUserInfo } from '../../../../../shared/types/mail-user-info.type';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { HighlightTextPipe } from '../../../../../shared/pipes/highlight-text.pipe';
import { FormatDatePipe } from '../../../../../shared/pipes/format-date.pipe';
import { FormatTimePipe } from '../../../../../shared/pipes/format-time.pipe';
import { FormatUserInfoPipe } from '../../../../../shared/pipes/format-user-info.pipe';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { HighlightService } from '../../../../../core/services/highlight.service';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_MD } from '../../../../../shared/consts/icon-size.consts';

@Component({
  selector: 'app-mail-metadata',
  standalone: true,
  imports: [IconComponent, HighlightTextPipe, FormatDatePipe, FormatTimePipe, FormatUserInfoPipe],
  templateUrl: './mail-metadata.component.html',
  styleUrl: './mail-metadata.component.scss',
})
export class MailMetadataComponent {
  private _highlightService: HighlightService = inject(HighlightService);
  private _formatUserInfoPipe: FormatUserInfoPipe = inject(FormatUserInfoPipe);

  public $mail: InputSignal<Mail> = input.required<Mail>({ alias: 'mail' });

  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_MD = ICON_SIZE_MD;
  public readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;

  public $searchTerms: Signal<string[]> = computed<string[]>(() => this._highlightService.$searchTerms());

  public $toDisplay: Signal<string> = computed<string>(() => {
    return this.$mail()
      .to.map((user: MailUserInfo) => this._formatUserInfoPipe.transform(user))
      .join(', ');
  });

  public $ccDisplay: Signal<string> = computed<string>(() => {
    const cc: MailUserInfo[] | undefined = this.$mail().cc;
    if (!cc || cc.length === 0) {
      return '';
    }
    return cc.map((user: MailUserInfo) => this._formatUserInfoPipe.transform(user)).join(', ');
  });

  public $bccDisplay: Signal<string> = computed<string>(() => {
    const bcc: MailUserInfo[] | undefined = this.$mail().bcc;
    if (!bcc || bcc.length === 0) {
      return '';
    }
    return bcc.map((user: MailUserInfo) => this._formatUserInfoPipe.transform(user)).join(', ');
  });
}
