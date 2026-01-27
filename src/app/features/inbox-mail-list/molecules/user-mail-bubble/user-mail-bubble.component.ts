import { Component, input } from '@angular/core';
import { INBOX_TRANSLATIONS } from '../../../../shared';

@Component({
  selector: 'app-user-mail-bubble',
  standalone: true,
  imports: [],
  templateUrl: './user-mail-bubble.component.html',
  styleUrl: './user-mail-bubble.component.scss',
})
export class UserMailBubbleComponent {
  $userEmail = input.required<string>({ alias: 'userEmail' });
  $mailCount = input.required<number>({ alias: 'mailCount' });

  readonly translations = INBOX_TRANSLATIONS;
}
