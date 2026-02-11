import { Component, output, signal, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { BUTTON_TRANSLATIONS } from '../../../../shared/translations/common.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-alert-button',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './alert-button.component.html',
  styleUrl: './alert-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AlertButtonComponent {
  openIssue = output<void>();
  openRequest = output<void>();

  $isPopupOpen = signal(false);

  readonly buttonLabels = BUTTON_TRANSLATIONS;

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
