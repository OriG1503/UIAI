import { Injectable, signal, computed } from '@angular/core';
import { Mail } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class SelectedMailService {
  private _selectedMail = signal<Mail | null>(null);

  readonly selectedMail = this._selectedMail.asReadonly();

  $hasSelectedMail = computed(() => this._selectedMail() !== null);

  setSelectedMail(mail: Mail | null): void {
    this._selectedMail.set(mail);
  }

  clearSelectedMail(): void {
    this._selectedMail.set(null);
  }
}
