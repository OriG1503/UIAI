import { Component, input, output } from '@angular/core';
import { MailFilter, MAIL_FILTER_LABELS } from '../../../../shared';

@Component({
  selector: 'app-mail-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './mail-filter-bar.component.html',
  styleUrl: './mail-filter-bar.component.scss',
})
export class MailFilterBarComponent {
  $activeFilter = input<MailFilter>('all', { alias: 'activeFilter' });
  filterChange = output<MailFilter>();

  readonly filters: MailFilter[] = ['all', 'read', 'unread'];
  readonly labels = MAIL_FILTER_LABELS;

  onFilterClick(filter: MailFilter): void {
    this.filterChange.emit(filter);
  }
}
