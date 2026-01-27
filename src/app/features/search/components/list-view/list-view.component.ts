import { Component, inject } from '@angular/core';
import { MailListComponent } from '../../../inbox-mail-list/organisms/mail-list/mail-list.component';
import { MailContentViewComponent } from '../../../mail-content/organisms/mail-content-view/mail-content-view.component';
import { SelectedMailService } from '../../../../core/services/selected-mail.service';

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
