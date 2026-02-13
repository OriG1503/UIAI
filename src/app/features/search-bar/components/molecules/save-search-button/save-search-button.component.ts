import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BUTTON_TRANSLATIONS, PLACEHOLDER_TRANSLATIONS, COMMON_TRANSLATIONS } from '../../../../../shared/translations/common.translations';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-save-search-button',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './save-search-button.component.html',
  styleUrl: './save-search-button.component.scss',
})
export class SaveSearchButtonComponent {
  readonly ICON_NAMES = ICON_NAMES;

  save = output<string>();

  $isPopupOpen = signal(false);
  $searchName = signal('');

  readonly buttonLabels = BUTTON_TRANSLATIONS;
  readonly placeholders = PLACEHOLDER_TRANSLATIONS;
  readonly common = COMMON_TRANSLATIONS;

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
    if (!this.$isPopupOpen()) {
      this.$searchName.set('');
    }
  }

  public closePopup(): void {
    this.$isPopupOpen.set(false);
    this.$searchName.set('');
  }

  public onSave(): void {
    const name = this.$searchName();
    if (name.trim()) {
      this.save.emit(name);
      this.closePopup();
    }
  }
}
