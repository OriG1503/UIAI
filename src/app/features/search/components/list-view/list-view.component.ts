import { Component } from '@angular/core';
import { MailListComponent } from '../../../inbox-mail-list/organisms/mail-list/mail-list.component';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [MailListComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
})
export class ListViewComponent {}
