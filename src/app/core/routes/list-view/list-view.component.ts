import { Component, inject, Signal } from '@angular/core';
import { MailListComponent } from '../../../features/inbox-mail-list/components/organisms/mail-list/mail-list.component';
import { MailContentViewComponent } from '../../../features/mail-content/components/organisms/mail-content-view/mail-content-view.component';
import { SelectedMailService } from '../../services/selected-mail.service';
import { Mail } from '../../../shared/types/mail.type';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [MailListComponent, MailContentViewComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
})
export class ListViewComponent {
  private _selectedMailService: SelectedMailService = inject(SelectedMailService);

  readonly $selectedMail: Signal<Mail | null> = this._selectedMailService.selectedMail;
}
