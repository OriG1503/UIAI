import { Component, input, output, OutputEmitterRef, signal, HostListener, ElementRef, inject } from '@angular/core';
import { INBOX_LABEL_MAPPING } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/constants/icon-name.constants';
import { Encoding } from '../../../types/encoding.type';
import { ENCODING_LABELS } from '../../../mapping/mail-content.label-map';

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
  encodingChange: OutputEmitterRef<Encoding> = output<Encoding>();
  downloadClick: OutputEmitterRef<void> = output<void>();
  previousClick: OutputEmitterRef<void> = output<void>();
  nextClick: OutputEmitterRef<void> = output<void>();

  $isEncodingPopupOpen = signal<boolean>(false);

  readonly ICON_NAMES = ICON_NAMES;
  readonly encodings: Encoding[] = ['none', 'utf-8', 'iso-8859-1', 'windows-1255'];
  readonly encodingLabels = ENCODING_LABELS;
  readonly translations = INBOX_LABEL_MAPPING;

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
