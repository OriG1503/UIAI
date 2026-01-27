import { Component, output, signal } from '@angular/core';
import { SearchViewType } from '../../types';
import { SEARCH_VIEW_LABELS, SEARCH_TRANSLATIONS } from '../../translations';
import { IconComponent } from '../../atoms';

@Component({
  selector: 'app-run-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './run-button.component.html',
  styleUrl: './run-button.component.scss',
})
export class RunButtonComponent {
  run = output<SearchViewType>();

  $isPopupOpen = signal(false);

  readonly viewLabels = SEARCH_VIEW_LABELS;
  readonly translations = SEARCH_TRANSLATIONS;

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
