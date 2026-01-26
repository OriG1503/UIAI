import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-search-button',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './save-search-button.component.html',
  styleUrl: './save-search-button.component.scss',
})
export class SaveSearchButtonComponent {
  save = output<string>();

  $isPopupOpen = signal(false);
  $searchName = signal('');

  togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
    if (!this.$isPopupOpen()) {
      this.$searchName.set('');
    }
  }

  closePopup(): void {
    this.$isPopupOpen.set(false);
    this.$searchName.set('');
  }

  onSave(): void {
    const name = this.$searchName();
    if (name.trim()) {
      this.save.emit(name);
      this.closePopup();
    }
  }
}
