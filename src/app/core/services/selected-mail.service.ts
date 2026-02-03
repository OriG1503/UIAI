import { Injectable, signal, computed, inject } from '@angular/core';
import { Mail } from '../../shared';
import { MockMailService } from './mock-mail.service';

@Injectable({
  providedIn: 'root',
})
export class SelectedMailService {
  private _mailService = inject(MockMailService);
  private _selectedMail = signal<Mail | null>(null);
  private _mailList = signal<Mail[]>([]);

  readonly selectedMail = this._selectedMail.asReadonly();
  readonly mailList = this._mailList.asReadonly();

  $hasSelectedMail = computed(() => this._selectedMail() !== null);

  $selectedIndex = computed(() => {
    const mail = this._selectedMail();
    const list = this._mailList();
    if (!mail || list.length === 0) return -1;
    return list.findIndex((m) => m.filename === mail.filename);
  });

  $hasPrevious = computed(() => this.$selectedIndex() > 0);

  $hasNext = computed(() => {
    const index = this.$selectedIndex();
    const list = this._mailList();
    return index >= 0 && index < list.length - 1;
  });

  public setSelectedMail(mail: Mail | null): void {
    this._selectedMail.set(mail);
  }

  public setMailList(mails: Mail[]): void {
    this._mailList.set(mails);
  }

  public clearSelectedMail(): void {
    this._selectedMail.set(null);
  }

  public selectPrevious(): void {
    const index = this.$selectedIndex();
    const list = this._mailList();
    if (index > 0) {
      const mail = list[index - 1];
      this._mailService.markAsRead(mail.filename);
      this._selectedMail.set(mail);
    }
  }

  public selectNext(): void {
    const index = this.$selectedIndex();
    const list = this._mailList();
    if (index >= 0 && index < list.length - 1) {
      const mail = list[index + 1];
      this._mailService.markAsRead(mail.filename);
      this._selectedMail.set(mail);
    }
  }
}
