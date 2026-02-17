import { Component, output, OutputEmitterRef, signal, ViewEncapsulation } from '@angular/core';
import { BUTTON_LABEL_MAPPING } from '../../../../../shared/mapping/common.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';

@Component({
  selector: 'app-alert-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './alert-button.component.html',
  styleUrl: './alert-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AlertButtonComponent {
  readonly ICON_NAMES = ICON_NAMES;

  openIssue: OutputEmitterRef<void> = output<void>();
  openRequest: OutputEmitterRef<void> = output<void>();

  $isPopupOpen = signal(false);

  readonly buttonLabels = BUTTON_LABEL_MAPPING;

  private _closeTimeout: ReturnType<typeof setTimeout> | null = null;

  public onMouseEnter(): void {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = null;
    }
    this.$isPopupOpen.set(true);
  }

  public onMouseLeave(): void {
    this._closeTimeout = setTimeout(() => {
      this.$isPopupOpen.set(false);
      this._closeTimeout = null;
    }, 150);
  }

  public onIssueClick(): void {
    this.openIssue.emit();
    this.$isPopupOpen.set(false);
  }

  public onRequestClick(): void {
    this.openRequest.emit();
    this.$isPopupOpen.set(false);
  }
}
