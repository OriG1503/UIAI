import { Component, input, InputSignal } from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';

@Component({
  selector: 'app-user-mail-bubble',
  standalone: true,
  imports: [],
  templateUrl: './user-mail-bubble.component.html',
  styleUrl: './user-mail-bubble.component.scss',
})
export class UserMailBubbleComponent {
  $userEmail: InputSignal<string> = input.required<string>({ alias: 'userEmail' });
  $mailCount: InputSignal<number> = input.required<number>({ alias: 'mailCount' });

  readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;
}
