import { Component, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BUTTON_LABEL_MAP,
  PLACEHOLDER_LABEL_MAP,
  COMMON_LABEL_MAP,
} from '../../../../../shared/mapping/common.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';

@Component({
  selector: 'app-save-search-button',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './save-search-button.component.html',
  styleUrl: './save-search-button.component.scss',
})
export class SaveSearchButtonComponent {
  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  save: OutputEmitterRef<string> = output<string>();

  $isPopupOpen: WritableSignal<boolean> = signal<boolean>(false);
  $searchName: WritableSignal<string> = signal<string>('');

  readonly buttonLabels: typeof BUTTON_LABEL_MAP = BUTTON_LABEL_MAP;
  readonly placeholders: typeof PLACEHOLDER_LABEL_MAP = PLACEHOLDER_LABEL_MAP;
  readonly common: typeof COMMON_LABEL_MAP = COMMON_LABEL_MAP;

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen: boolean) => !isOpen);
    if (!this.$isPopupOpen()) {
      this.$searchName.set('');
    }
  }

  public closePopup(): void {
    this.$isPopupOpen.set(false);
    this.$searchName.set('');
  }

  public onSave(): void {
    const name: string = this.$searchName();
    if (name.trim()) {
      this.save.emit(name);
      this.closePopup();
    }
  }
}
