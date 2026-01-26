import { Component, output, signal } from '@angular/core';
import { SearchViewType } from './search-view-type.type';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss',
})
export class RunButtonComponent {
  run = output<SearchViewType>();

  $isPopupOpen = signal(false);

  togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
  }

  closePopup(): void {
    this.$isPopupOpen.set(false);
  }

  selectOption(viewType: SearchViewType): void {
    this.run.emit(viewType);
    this.closePopup();
  }
}
