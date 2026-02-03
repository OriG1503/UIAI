import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { INBOX_TRANSLATIONS } from '../../../../shared/translations/inbox.translations';
import { IconComponent } from '../../../../shared/atoms/icon/icon.component';
import { Encoding } from '../../types/encoding.type';
import { ENCODING_LABELS } from '../../translations/mail-content.translations';

@Component({
  selector: 'app-mail-content-toolbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-content-toolbar.component.html',
  styleUrl: './mail-content-toolbar.component.scss',
})
export class MailContentToolbarComponent {
  private _elementRef = inject(ElementRef);

  $selectedEncoding = input<Encoding>('none', { alias: 'selectedEncoding' });
  $hasPrevious = input<boolean>(false, { alias: 'hasPrevious' });
  $hasNext = input<boolean>(false, { alias: 'hasNext' });
  encodingChange = output<Encoding>();
  downloadClick = output<void>();
  previousClick = output<void>();
  nextClick = output<void>();

  $isEncodingPopupOpen = signal<boolean>(false);

  readonly encodings: Encoding[] = ['none', 'utf-8', 'iso-8859-1', 'windows-1255'];
  readonly encodingLabels = ENCODING_LABELS;
  readonly translations = INBOX_TRANSLATIONS;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const encodingWrapper = this._elementRef.nativeElement.querySelector('.encoding-wrapper');
    if (encodingWrapper && !encodingWrapper.contains(event.target)) {
      this.$isEncodingPopupOpen.set(false);
    }
  }

  public onEncodingClick(): void {
    this.$isEncodingPopupOpen.update((value) => !value);
  }

  public onEncodingSelect(encoding: Encoding): void {
    this.$isEncodingPopupOpen.set(false);
    this.encodingChange.emit(encoding);
  }

  public onDownloadClick(): void {
    this.downloadClick.emit();
  }

  public onPreviousClick(): void {
    this.previousClick.emit();
  }

  public onNextClick(): void {
    this.nextClick.emit();
  }
}
