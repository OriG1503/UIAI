import { Component, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { PopupOption } from '../../types/popup-option.type';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-hover-popup',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './hover-popup.component.html',
  styleUrl: './hover-popup.component.scss',
})
export class HoverPopupComponent {
  $options: InputSignal<PopupOption[]> = input.required<PopupOption[]>({ alias: 'options' });

  optionSelect: OutputEmitterRef<string> = output<string>();

  $isOpen: WritableSignal<boolean> = signal<boolean>(false);
  $position: WritableSignal<{ top: number; right: number }> = signal({ top: 0, right: 0 });
  private _elementRef: ElementRef = inject(ElementRef);
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;

  public onTriggerEnter(): void {
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    const rect: DOMRect = this._elementRef.nativeElement.getBoundingClientRect();
    this.$position.set({ top: rect.bottom, right: window.innerWidth - (rect.left + rect.width / 2) });
    this.$isOpen.set(true);
  }

  public onTriggerLeave(): void {
    this._closeTimer = setTimeout(() => {
      this.$isOpen.set(false);
      this._closeTimer = null;
    }, 150);
  }

  public onPopupEnter(): void {
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  public onPopupLeave(): void {
    this.$isOpen.set(false);
  }

  public onSelect(option: PopupOption): void {
    this.optionSelect.emit(option.value);
    this.$isOpen.set(false);
  }
}
