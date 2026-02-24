import { Component, output, OutputEmitterRef, signal, computed, WritableSignal, Signal } from '@angular/core';
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
  public readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;

  public save: OutputEmitterRef<string> = output<string>();

  public $isPopupOpen: WritableSignal<boolean> = signal<boolean>(false);
  public $searchName: WritableSignal<string> = signal<string>('');

  public $triggerIconColor: Signal<string> = computed<string>(() =>
    this.$isPopupOpen() ? 'var(--color-white)' : 'var(--color-dark-navy)',
  );

  public readonly buttonLabels: typeof BUTTON_LABEL_MAP = BUTTON_LABEL_MAP;
  public readonly placeholders: typeof PLACEHOLDER_LABEL_MAP = PLACEHOLDER_LABEL_MAP;
  public readonly common: typeof COMMON_LABEL_MAP = COMMON_LABEL_MAP;

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
