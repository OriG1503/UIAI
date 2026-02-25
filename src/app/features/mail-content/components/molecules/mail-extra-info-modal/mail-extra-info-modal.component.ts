import { Component, output, OutputEmitterRef } from '@angular/core';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { ICON_SIZE_MD } from '../../../../../shared/consts/icon-size.consts';
import { MAIL_EXTRA_INFO_LABEL_MAP } from '../../../mapping/mail-content.label-map';

@Component({
  selector: 'app-mail-extra-info-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-extra-info-modal.component.html',
  styleUrl: './mail-extra-info-modal.component.scss',
})
export class MailExtraInfoModalComponent {
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  public readonly ICON_SIZE_MD = ICON_SIZE_MD;
  public readonly translations: typeof MAIL_EXTRA_INFO_LABEL_MAP = MAIL_EXTRA_INFO_LABEL_MAP;

  public closeClick: OutputEmitterRef<void> = output<void>();

  public onOverlayClick(): void {
    this.closeClick.emit();
  }
}
