import { Component, output, OutputEmitterRef, signal, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
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

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.$isPopupOpen.set(false);
    }
  }

  public togglePopup(): void {
    this.$isPopupOpen.update((isOpen) => !isOpen);
  }

  public closePopup(): void {
    this.$isPopupOpen.set(false);
  }

  public onIssueClick(): void {
    this.openIssue.emit();
    this.closePopup();
  }

  public onRequestClick(): void {
    this.openRequest.emit();
    this.closePopup();
  }
}
