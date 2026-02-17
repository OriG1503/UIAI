import {
  Component,
  input,
  output,
  OutputEmitterRef,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
  InputSignal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { INBOX_LABEL_MAP } from '../../../../../shared/mapping/inbox.label-map';
import { IconComponent } from '../../../../../shared/atoms/icon/icon.component';
import { ICON_NAMES } from '../../../../../shared/consts/icon-name.consts';
import { Encoding } from '../../../types/encoding.type';
import { ENCODING_LABEL_MAP, HIGHLIGHT_NAV_LABEL_MAP } from '../../../mapping/mail-content.label-map';

@Component({
  selector: 'app-mail-content-toolbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './mail-content-toolbar.component.html',
  styleUrl: './mail-content-toolbar.component.scss',
})
export class MailContentToolbarComponent {
  private _elementRef: ElementRef = inject(ElementRef);

  $selectedEncoding: InputSignal<Encoding> = input<Encoding>('none', { alias: 'selectedEncoding' });
  $currentHighlightIndex: InputSignal<number> = input<number>(0, { alias: 'currentHighlightIndex' });
  $totalHighlights: InputSignal<number> = input<number>(0, { alias: 'totalHighlights' });

  encodingChange: OutputEmitterRef<Encoding> = output<Encoding>();
  downloadClick: OutputEmitterRef<void> = output<void>();
  previousClick: OutputEmitterRef<void> = output<void>();
  nextClick: OutputEmitterRef<void> = output<void>();

  $isEncodingPopupOpen: WritableSignal<boolean> = signal<boolean>(false);

  $hasPrevious: Signal<boolean> = computed<boolean>(() => this.$totalHighlights() > 0);
  $hasNext: Signal<boolean> = computed<boolean>(() => this.$totalHighlights() > 0);

  readonly ICON_NAMES: typeof ICON_NAMES = ICON_NAMES;
  readonly encodings: Encoding[] = ['none', 'utf-8', 'iso-8859-1', 'windows-1255'];
  readonly encodingLabels: Record<Encoding, string> = ENCODING_LABEL_MAP;
  readonly translations: typeof INBOX_LABEL_MAP = INBOX_LABEL_MAP;
  readonly highlightLabels: typeof HIGHLIGHT_NAV_LABEL_MAP = HIGHLIGHT_NAV_LABEL_MAP;

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const encodingWrapper: HTMLElement | null = this._elementRef.nativeElement.querySelector('.encoding-wrapper');
    if (encodingWrapper && !encodingWrapper.contains(event.target as Node)) {
      this.$isEncodingPopupOpen.set(false);
    }
  }

  public onEncodingClick(): void {
    this.$isEncodingPopupOpen.update((value: boolean) => !value);
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
