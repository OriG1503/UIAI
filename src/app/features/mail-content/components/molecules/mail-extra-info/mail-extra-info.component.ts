import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { ExtraInfoRow } from '../../../types/extra-info-row.type';
import { MAIL_EXTRA_INFO_LABEL_MAP } from '../../../mapping/mail-content.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-mail-extra-info',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-extra-info.component.html',
  styleUrl: './mail-extra-info.component.scss',
})
export class MailExtraInfoComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  $rows: InputSignal<ExtraInfoRow[]> = input.required<ExtraInfoRow[]>({ alias: 'rows' });
  $title: InputSignal<string> = input<string>(MAIL_EXTRA_INFO_LABEL_MAP.title, { alias: 'title' });

  $isOpen: WritableSignal<boolean> = signal<boolean>(false);

  public onToggle(): void {
    this.$isOpen.update((open: boolean) => !open);
  }
}
