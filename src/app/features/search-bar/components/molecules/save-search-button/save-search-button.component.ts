import { Component, output, OutputEmitterRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BUTTON_LABEL_MAPPING, PLACEHOLDER_LABEL_MAPPING, COMMON_LABEL_MAPPING } from '../../../../../shared/mapping/common.label-map';
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

  save: OutputEmitterRef<string> = output<string>();

  $isPopupOpen = signal(false);
  $searchName = signal('');

  readonly buttonLabels = BUTTON_LABEL_MAPPING;
  readonly placeholders = PLACEHOLDER_LABEL_MAPPING;
  readonly common = COMMON_LABEL_MAPPING;

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
