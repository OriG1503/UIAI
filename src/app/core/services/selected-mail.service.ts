import { Injectable, signal, computed, inject, WritableSignal, Signal } from '@angular/core';
import { Mail } from '../../shared/types/mail.type';
import { MockMailService } from './mock-mail.service';
import { MockGraphMailService } from './mock-graph-mail.service';

@Injectable({
  providedIn: 'root',
})
export class SelectedMailService {
  private _mailService: MockMailService = inject(MockMailService);
  private _graphMailService: MockGraphMailService = inject(MockGraphMailService);
  private _selectedMail: WritableSignal<Mail | null> = signal<Mail | null>(null);
  private _mailList: WritableSignal<Mail[]> = signal<Mail[]>([]);

  readonly selectedMail: Signal<Mail | null> = this._selectedMail.asReadonly();
  readonly mailList: Signal<Mail[]> = this._mailList.asReadonly();

  $hasSelectedMail: Signal<boolean> = computed<boolean>(() => this._selectedMail() !== null);

  $selectedIndex: Signal<number> = computed<number>(() => {
    const mail: Mail | null = this._selectedMail();
    const list: Mail[] = this._mailList();
    if (!mail || list.length === 0) {
      return -1;
    }
    return list.findIndex((listMail: Mail) => listMail.filename === mail.filename);
  });

  $hasPrevious: Signal<boolean> = computed<boolean>(() => this.$selectedIndex() > 0);

  $hasNext: Signal<boolean> = computed<boolean>(() => {
    const index: number = this.$selectedIndex();
    const list: Mail[] = this._mailList();
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
    const index: number = this.$selectedIndex();
    const list: Mail[] = this._mailList();
    if (index > 0) {
      const mail: Mail = list[index - 1];
      this.markMailAsRead(mail);
      this._selectedMail.set(mail);
    }
  }

  public selectNext(): void {
    const index: number = this.$selectedIndex();
    const list: Mail[] = this._mailList();
    if (index >= 0 && index < list.length - 1) {
      const mail: Mail = list[index + 1];
      this.markMailAsRead(mail);
      this._selectedMail.set(mail);
    }
  }

  public markMailAsRead(mail: Mail): void {
    if (mail.filename.startsWith('graph-mail-')) {
      this._graphMailService.markAsRead(mail.filename);
    } else {
      this._mailService.markAsRead(mail.filename);
    }
  }

  public markMailAsUnread(mail: Mail): void {
    if (mail.filename.startsWith('graph-mail-')) {
      this._graphMailService.markAsUnread(mail.filename);
    } else {
      this._mailService.markAsUnread(mail.filename);
    }
  }
}
