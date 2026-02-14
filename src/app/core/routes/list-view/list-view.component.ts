import { Component, inject } from '@angular/core';
import { MailListComponent } from '../../../features/inbox-mail-list/components/organisms/mail-list/mail-list.component';
import { MailContentViewComponent } from '../../../features/mail-content/components/organisms/mail-content-view/mail-content-view.component';
import { SelectedMailService } from '../../services/selected-mail.service';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [MailListComponent, MailContentViewComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
})
export class ListViewComponent {
  private _selectedMailService = inject(SelectedMailService);

  readonly $selectedMail = this._selectedMailService.selectedMail;
}
